# UML Diagrams — Aura Health

Eight UML views of the platform described in the root [README](../README.md) and [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md). Those two documents cover the system architecture, module layering, and several sequence flows already — this document is the dedicated UML set: use case, activity, sequence, class, component, deployment, communication, and object diagrams, each modeling the real routes, services, and Mongoose schemas in `Backend/`.

> **Notation note:** Mermaid (the renderer used here) only has native syntax for `classDiagram`, `sequenceDiagram`, `erDiagram`, `stateDiagram`, and `flowchart`. It has no built-in use case, component, deployment, or communication diagram type, so those four are drawn with `flowchart` shapes chosen to match standard UML notation as closely as possible (ellipses for use cases, boxed components with connectors, nested boxes for deployment nodes, numbered links for communication). The class, sequence, and object diagrams use Mermaid's native, fully-compliant syntax.

## Contents

1. [Use Case Diagram](#1-use-case-diagram)
2. [Activity Diagram](#2-activity-diagram)
3. [Sequence Diagram](#3-sequence-diagram)
4. [Class Diagram](#4-class-diagram)
5. [Component Diagram](#5-component-diagram)
6. [Deployment Diagram](#6-deployment-diagram)
7. [Communication Diagram](#7-communication-diagram)
8. [Object Diagram](#8-object-diagram)

---

## 1. Use Case Diagram

Three human actors — Patient, Doctor, Admin — plus three external systems (Gemini, Cloudinary, SMTP) that participate directly in certain use cases. `Book Appointment` includes both booking paths (`appointrouter.js` exposes both the legacy request flow and the newer slot-based flow, per the ER/module-layering diagrams in the README); registration and password reset both include OTP verification, backed by the TTL-expiring `otps` and `pendingusers` collections.

![Use Case Diagram](uml-images/01-usecase.png)

```mermaid
flowchart LR
    Patient(Patient)
    Doctor(Doctor)
    Admin(Admin)
    Gemini[["Gemini AI"]]
    Cloudinary[["Cloudinary"]]
    SMTP[["SMTP / Nodemailer"]]

    subgraph Sys["Aura Health Platform"]
        UC1(["Register & verify OTP"])
        UC2(["Login / Logout"])
        UC3(["Forgot / reset password"])
        UC4(["Manage profile"])
        UC5(["Search & view doctors"])
        UC6(["Book appointment"])
        UC6a(["Legacy request<br/>appointrequest → admin approval"])
        UC6b(["Self-serve slot booking"])
        UC7(["View my appointments"])
        UC8(["Join video consultation"])
        UC9(["Real-time chat"])
        UC10(["Rate doctor"])
        UC11(["Use AI chatbot"])
        UC12(["AI medical report analysis"])
        UC13(["AI skin analysis"])

        UC14(["Apply as doctor<br/>upload certificate"])
        UC15(["View appointment requests"])
        UC16(["Approve / reject appointment"])
        UC17(["View ratings & feedback"])

        UC18(["Review doctor applications"])
        UC19(["Approve / reject doctor permission"])
        UC20(["Manually schedule appointment<br/>legacy path"])
        UC21(["View / block / unblock users"])
        UC22(["View / block / unblock doctors"])
    end

    Patient --> UC1 & UC2 & UC3 & UC4 & UC5 & UC6 & UC7 & UC8 & UC9 & UC10 & UC11 & UC12 & UC13
    Doctor --> UC2 & UC3 & UC4 & UC14 & UC15 & UC16 & UC7 & UC8 & UC9 & UC17
    Admin --> UC2 & UC18 & UC19 & UC20 & UC21 & UC22

    UC6 -.->|"<<include>>"| UC6a
    UC6 -.->|"<<include>>"| UC6b
    UC1 -.->|"<<include>>"| UC3
    UC19 -.->|"<<extend>>"| SMTP
    UC14 -->|"uploads via"| Cloudinary
    UC4 -->|"uploads via"| Cloudinary
    UC12 -->|"uploads via"| Cloudinary
    UC1 -->|"delivers OTP via"| SMTP
    UC3 -->|"delivers OTP via"| SMTP
    UC11 -->|"queries"| Gemini
    UC12 -->|"queries"| Gemini
    UC13 -->|"queries"| Gemini
```

---

## 2. Activity Diagram

The patient-facing journey from authentication through appointment booking to consultation — the workflow that touches the most decision points and both booking paths at once (legacy admin-approved vs. self-serve slots), converging on the fork where a confirmed appointment simultaneously unlocks chat and video.

![Activity Diagram](uml-images/02-activity.png)

```mermaid
flowchart TD
    Start([Start]) --> Login{Logged in?}
    Login -->|No| Auth[Register / verify OTP, then log in]
    Auth --> Login
    Login -->|Yes| Search[Search & filter doctors by specialization]
    Search --> ViewProfile[View doctor profile & availability]
    ViewProfile --> Choice{Choose booking method}

    Choice -->|Legacy request| Submit[POST /appointrequest]
    Submit --> AdminDecision{Admin reviews request}
    AdminDecision -->|Rejected| Reject[Status set to rejected]
    Reject --> End([End])
    AdminDecision -->|Approved| Manual[Admin/frontend supplies date & time<br/>POST /approveappointment]
    Manual --> Persist[(Insert appointmentnew document)]

    Choice -->|Self-serve slot| Slots[GET /available-slots<br/>generate slots minus already-booked times]
    Slots --> Pick[Patient selects a free slot]
    Pick --> Recheck{Still free at insert time?}
    Recheck -->|No — lost race<br/>unique index rejects duplicate| Slots
    Recheck -->|Yes| Persist

    Persist --> Fork{{Appointment confirmed}}
    Fork --> ChatOn[Chat room enabled for user+doctor pair]
    Fork --> MeetOn[/meeting/:appointmentId authorized]
    ChatOn --> Join[Both parties join at scheduled time]
    MeetOn --> Join
    Join --> Consult[Video call over WebRTC + live chat]
    Consult --> Rate[Patient submits rating & feedback]
    Rate --> End
```

---

## 3. Sequence Diagram

Self-serve slot booking traced through the actual layers (`appointrouter.js` → `appointmentcontroller.js` → `service/appointment.js` → `appointmentnew` collection), including the double-booking race that the compound unique index (`{doctorid, date, time}`) is specifically there to catch — noted in the README's reliability section and confirmed in [appointment.js](../Backend/model/Appointment/appointment.js).

![Sequence Diagram](uml-images/03-sequence.png)

```mermaid
sequenceDiagram
    actor P as Patient
    participant FE as SlotBooking Wizard (Frontend)
    participant RT as appointrouter.js
    participant CT as appointmentcontroller.js
    participant SV as service/appointment.js
    participant DB as MongoDB (appointmentnew)

    P->>FE: select doctor + date
    FE->>RT: GET /available-slots?doctorId&date
    RT->>CT: getAvailableSlots(req, res)
    CT->>SV: generateTimeSlots(doctorId, date)
    SV->>DB: find booked {doctorid, date}
    DB-->>SV: booked times []
    SV-->>CT: free slots []
    CT-->>RT: 200 free slots
    RT-->>FE: available slots
    FE-->>P: render selectable slots

    P->>FE: pick slot, confirm booking
    FE->>RT: POST /book-slot {doctorId, date, time}
    RT->>CT: bookSlot(req, res)
    CT->>SV: bookSlot(userid, doctorid, date, time)
    SV->>DB: insert appointmentnew

    alt slot taken between GET and POST (race lost)
        DB-->>SV: E11000 duplicate key error
        SV-->>CT: throw conflict
        CT-->>RT: 409 slot no longer available
        RT-->>FE: booking failed, refresh slots
        FE-->>P: show error, reload available slots
    else insert succeeds
        DB-->>SV: appointment document
        SV-->>CT: appointment created
        CT-->>RT: 201 booking confirmed
        RT-->>FE: booking confirmed
        FE-->>P: SuccessScreen
    end

    Note over P,DB: This appointment now authorizes chatrouter.js<br/>and meetingSocket.js for this user+doctor pair
```

---

## 4. Class Diagram

The domain model as it's actually defined across `Backend/model/` — every attribute below is copied from the real Mongoose schemas, not inferred. `Doctor` and `DoctorPermission` are deliberately separate collections (`doctor` vs. `doctorpermissions`): a doctor only gets a `doctor` document once an admin approves their application, which is why the relationship between them is a dependency, not an association. `Report` is the one model with an actual Mongoose `ref` (`ReportMessage` is embedded, not referenced).

![Class Diagram](uml-images/04-class.png)

```mermaid
classDiagram
    class User {
        +ObjectId _id
        +String email
        +String password
        +String name
        +Number contact
        +String address
        +String userstatus
        +String gender
        +Date dob
        +String fatherName
        +String motherName
        +String maritalStatus
        +String nationality
        +String bloodGroup
        +String emergencyContactName
        +Number emergencyContactNumber
        +String emergencyRelation
        +String image
        +Date createdAt
    }

    class Doctor {
        +ObjectId _id
        +String email
        +String password
        +String name
        +String specialization
        +Number contact
        +String address
        +String gender
        +Date dateOfBirth
        +String title
        +String institution
        +Number year
        +Number experienceYears
        +String hospitalName
        +String HospitalAddress
        +String bio
        +String image
        +String doctorstatus
    }

    class Admin {
        +ObjectId _id
        +String email
        +String password
        +Number contact
    }

    class DoctorPermission {
        <<doctorpermissions>>
        +ObjectId _id
        +String email
        +String password
        +String name
        +String specialization
        +Number contact
        +String address
        +String certificate
        +String permission
    }

    class Appointment {
        <<appointmentnew>>
        +ObjectId _id
        +String email
        +String name
        +String userid
        +String doctorid
        +String doctormail
        +String description
        +String date
        +String time
    }

    class AppointmentRequest {
        <<appointmentrequest>>
        +ObjectId _id
        +String email
        +String name
        +String userid
        +String doctorid
        +String doctormail
        +String description
        +String status
    }

    class Message {
        +ObjectId _id
        +String userId
        +String doctorId
        +String senderRole
        +String text
        +Date createdAt
    }

    class DoctorRating {
        <<ratings>>
        +ObjectId _id
        +String doctorId
        +String userId
        +Number rating
        +String description
        +Date date
    }

    class Report {
        +ObjectId _id
        +ObjectId user
        +String title
        +String summary
        +String fileUrl
        +ReportMessage[] messages
        +Date createdAt
    }

    class ReportMessage {
        <<embedded>>
        +String role
        +String text
        +Boolean isPdf
    }

    class OTP {
        <<otps>>
        +ObjectId _id
        +String email
        +String role
        +Number otp
        +Date createdAt
    }

    class PendingUser {
        <<pendingusers>>
        +ObjectId _id
        +String email
        +String name
        +String password
        +String contact
        +String address
        +String otp
        +Date createdAt
    }

    User "1" --> "0..*" Appointment : books
    Doctor "1" --> "0..*" Appointment : accepts
    User "1" --> "0..*" AppointmentRequest : submits
    Doctor "1" --> "0..*" AppointmentRequest : receives
    User "1" --> "0..*" Message : sends
    Doctor "1" --> "0..*" Message : sends
    User "1" --> "0..*" DoctorRating : writes
    Doctor "1" --> "0..*" DoctorRating : "rated by"
    User "1" --> "0..*" Report : owns
    Report "1" *-- "0..*" ReportMessage : contains
    DoctorPermission ..> Doctor : "approved application becomes"
    User ..> PendingUser : "staged during OTP registration"
    User ..> OTP : "password reset, by email+role"
    Doctor ..> OTP : "password reset, by email+role"
```

---

## 5. Component Diagram

Every feature module follows the same `Router → Controller → Service → Model` layering (as already noted in the README), except the bot/report/skin-analysis routers, which call their service directly. This diagram shows that layering plus every external component it talks to.

![Component Diagram](uml-images/05-component.png)

```mermaid
flowchart TB
    subgraph FE["Frontend — React 19 + Vite SPA"]
        Pages["Pages<br/>dashboards, booking wizard, chat, meeting"]
        Shared["Shared components<br/>Layouts, PrivateRoutes, ChatWindow, DoctorCard"]
        SocketClient["socket.js<br/>Socket.IO client singleton"]
    end

    subgraph BE["Backend — Node.js + Express 5"]
        Routers["Routers<br/>admin · doctor · user · appointment ·<br/>rating · bot · chat · report · skin"]
        MW["Middleware<br/>JWT guards (admin/doctor/user)<br/>Multer · Redis rate-limit"]
        Controllers["Controllers"]
        Services["Services<br/>business logic"]
        Models["Models<br/>Mongoose schemas"]
        ChatIO["chatSocket.js"]
        MeetIO["meetingSocket.js"]
    end

    subgraph Ext["External Systems"]
        Mongo[("MongoDB")]
        Redis[("Redis<br/>pub/sub + rate-limit store")]
        Cloud[("Cloudinary")]
        Gemini(["Google Gemini API"])
        SMTPsvc(["SMTP via Nodemailer"])
        STUN{{"STUN server"}}
    end

    Pages --> Shared
    Pages -->|"REST — axios"| Routers
    Pages --> SocketClient
    SocketClient -->|"Socket.IO protocol"| ChatIO
    SocketClient -->|"Socket.IO protocol"| MeetIO

    Routers --> MW --> Controllers --> Services --> Models --> Mongo
    Services -->|"upload/fetch media"| Cloud
    Services -->|"send OTP / credentials"| SMTPsvc
    Services -->|"chatbot / report / skin analysis"| Gemini
    ChatIO --> Models
    ChatIO <-.->|"@socket.io/redis-adapter"| Redis
    MeetIO <-.->|"@socket.io/redis-adapter"| Redis
    MW <-.->|"rate-limit-redis"| Redis
    Pages -.->|"ICE negotiation"| STUN
```

---

## 6. Deployment Diagram

The production topology from the README's [Horizontal Scaling](../README.md#horizontal-scaling--reverse-proxy) section, formalized as UML deployment nodes: two Dockerized backend instances behind Nginx on one VM, shared managed MongoDB/Redis, and the browser-to-browser WebRTC path that never touches the server.

![Deployment Diagram](uml-images/06-deployment.png)

```mermaid
flowchart TB
    subgraph ClientDevice["«device» Client Device"]
        Browser["Browser<br/>React SPA + Socket.IO client + WebRTC"]
    end

    subgraph PeerDeviceBox["«device» Peer Client Device"]
        PeerBrowser["Browser<br/>call partner"]
    end

    subgraph Vercel["«cloud» Vercel"]
        Static["Static build — Frontend"]
    end

    subgraph VM["«device» VM / EC2 instance"]
        subgraph Docker["«execution environment» Docker Engine"]
            Nginx["«container» Nginx<br/>reverse proxy · ip_hash sticky sessions · :80"]
            B1["«container» backend1<br/>Express + Socket.IO :5000"]
            B2["«container» backend2<br/>Express + Socket.IO :5000"]
        end
    end

    subgraph MongoCloud["«cloud» MongoDB Atlas"]
        MongoDB[("MongoDB cluster")]
    end

    subgraph RedisCloud["«cloud» Redis provider"]
        RedisDB[("Redis instance")]
    end

    CloudinaryCloud["«cloud» Cloudinary"]
    GeminiCloud["«cloud» Google Gemini API"]
    SMTPCloud["«cloud» SMTP / Gmail"]
    STUNSrv["«cloud» STUN server<br/>stun.l.google.com:19302"]

    Browser -->|HTTPS| Static
    Browser -->|"HTTP / WS :80"| Nginx
    Nginx -->|sticky by client IP| B1
    Nginx -->|sticky by client IP| B2
    B1 -->|mongodb+srv://| MongoDB
    B2 -->|mongodb+srv://| MongoDB
    B1 <-.->|rediss://| RedisDB
    B2 <-.->|rediss://| RedisDB
    B1 --> CloudinaryCloud
    B1 --> GeminiCloud
    B1 --> SMTPCloud
    Browser <-.->|ICE| STUNSrv
    PeerBrowser <-.->|ICE| STUNSrv
    Browser ==>|"WebRTC media — P2P"| PeerBrowser
```

---

## 7. Communication Diagram

Real-time chat, drawn as a communication diagram: objects linked by association, with the interaction sequence numbered on each link rather than laid out on a timeline. This is the same feature as the chat sequence diagram in the README, viewed the other way — object topology first, message order second.

![Communication Diagram](uml-images/07-communication.png)

```mermaid
flowchart LR
    P(["patientClient : Browser"])
    D(["doctorClient : Browser"])
    S["chatSocket : Socket.IO Server<br/>JWT verify, room membership"]
    Svc["chatService : chatservice.js"]
    DB[("message : MongoDB")]
    R[("redisAdapter")]

    P -- "1: connect(JWT)" --> S
    P -- "2: joinConversation(userId, doctorId)" --> S
    D -- "3: joinConversation(userId, doctorId)" --> S
    P -- "4: sendMessage(text)" --> S
    S -- "5: saveMessage(userId, doctorId, senderRole, text)" --> Svc
    Svc -- "6: insertOne()" --> DB
    S <-- "7: publish / subscribe (room)" --> R
    S -- "8: receiveMessage (room broadcast)" --> P
    S -- "9: receiveMessage (room broadcast)" --> D
```

---

## 8. Object Diagram

A concrete runtime snapshot — one patient, one doctor, a confirmed appointment, two chat messages, and a rating — showing the same associations as the class diagram in [Section 4](#4-class-diagram), but instantiated with sample data instead of types.

![Object Diagram](uml-images/08-object.png)

```mermaid
flowchart TB
    U1["<u>user1 : User</u><br/>email = priya.sharma@gmail.com<br/>name = Priya Sharma<br/>userstatus = unblock<br/>bloodGroup = O+"]
    D1["<u>doctor1 : Doctor</u><br/>email = dr.mehta@aurahealth.com<br/>name = Dr. Anil Mehta<br/>specialization = Cardiology<br/>doctorstatus = unblock"]
    A1["<u>appointment1 : Appointment</u><br/>userid = user1._id<br/>doctorid = doctor1._id<br/>date = 2026-09-02<br/>time = 10:30"]
    M1["<u>message1 : Message</u><br/>userId = user1._id<br/>doctorId = doctor1._id<br/>senderRole = user<br/>text = Good morning doctor"]
    M2["<u>message2 : Message</u><br/>userId = user1._id<br/>doctorId = doctor1._id<br/>senderRole = doctor<br/>text = Good morning, lets begin"]
    R1["<u>rating1 : DoctorRating</u><br/>userId = user1._id<br/>doctorId = doctor1._id<br/>rating = 5<br/>description = Very attentive"]

    U1 -->|books| A1
    D1 -->|accepts| A1
    U1 -->|sends| M1
    D1 -->|sends| M2
    U1 -->|writes| R1
    D1 -->|receives| R1
    A1 -.->|enables chat room for| M1
    A1 -.->|enables chat room for| M2
```
