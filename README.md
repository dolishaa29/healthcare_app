# Aura Health

A full-stack telemedicine platform connecting patients with doctors — appointment booking, live video consultations, real-time chat, and AI-assisted health tools (symptom chatbot, medical report analysis, and skin analysis).

Live: [auraahealth.vercel.app](https://auraahealth.vercel.app)

## Features

- **Three role-based portals** — Admin, Doctor, and User (patient), each with its own dashboard and protected routes.
- **Doctor onboarding & verification** — doctors register with a certificate upload; admins review and approve/reject requests before the doctor is listed publicly.
- **Appointment booking** — patients browse doctors, view available slots, and book/manage appointments; doctors approve or reject requests.
- **Video consultations** — WebRTC peer-to-peer video calls between patient and doctor, signaled over Socket.IO, scoped to a specific appointment and gated so a call can only start once it's scheduled to begin.
- **Real-time chat** — persistent, per-conversation messaging between a patient and a doctor over Socket.IO, with chat history stored in MongoDB.
- **AI chatbot** — general-purpose health Q&A powered by Google Gemini (`gemini-2.5-flash`).
- **AI skin analysis** — uploads/captures a face image and returns skin type, concerns, causes, and recommendations via Gemini.
- **Medical report analysis** — patients upload a report file for AI-assisted analysis, with history retrieval.
- **Live capture** — webcam-based real-time analysis page.
- **Doctor ratings & feedback** — patients rate doctors after consultations; doctors can view aggregated feedback.
- **Auth & security** — JWT-based auth with role-specific middleware (admin/doctor/user), bcrypt password hashing, OTP-based password reset via email (Nodemailer).
- **Media storage** — profile images and doctor certificates uploaded via Multer and stored on Cloudinary.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Tailwind CSS v4
- Socket.IO client (chat & WebRTC signaling)
- Recharts (dashboard charts), Lucide icons

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO, with `@socket.io/redis-adapter` — chat + meeting/signaling events broadcast correctly across multiple server instances, not just within one process
- Redis (via `redis` client) — backs both the Socket.IO adapter and the rate limiter (`rate-limit-redis`)
- JWT auth, bcrypt/bcryptjs
- Multer + Cloudinary (file uploads)
- Nodemailer (OTP emails)
- Google Generative AI SDK (Gemini) — chatbot, skin analysis, report analysis
- `compression`, `express-rate-limit` — response compression and per-route rate limiting

**Infrastructure**
- Docker (`Backend/Dockerfile`, Node 22 Alpine)
- `docker-compose.yml` + Nginx (`nginx/nginx.conf`) — two backend instances load-balanced behind a reverse proxy with sticky sessions, for horizontal scaling

## Scaling & Reliability

Hardened specifically to run safely behind a load balancer with multiple backend instances:

- **Stateless auth** — JWT in cookies, no server-side session store, so any instance can handle any request
- **Redis-backed Socket.IO** (`@socket.io/redis-adapter`) — chat and meeting events reach the right client regardless of which instance it's connected to; verified end-to-end (two independent Socket.IO servers, one Redis, cross-instance delivery confirmed)
- **Redis-backed rate limiting** — `/chat` and `/skin-analysis` (the two routes that call the paid Gemini API) are capped per-IP through a shared store, not per-instance memory, so the limit actually holds across instances
- **Database indexes** — unique index on `email` (previously unindexed — every login and every authenticated request was a full collection scan), unique compound index on `{doctorid, date, time}` to close a double-booking race condition, indexes on chat/appointment lookup fields
- **Health checks** — `GET /healthz` reports Mongo connectivity and the responding instance's hostname; used by both Docker's own healthcheck and Nginx's passive failure detection
- **Graceful shutdown** — drains the HTTP server, Socket.IO, Mongo, and Redis connections on `SIGTERM`/`SIGINT` instead of hard-killing in-flight requests and open sockets mid-deploy
- **`trust proxy`** — correct client IPs and secure cookies once traffic passes through Nginx
- **Configurable CORS** (`CORS_ORIGINS` env var) — shared by REST and Socket.IO, instead of a hardcoded origin
- **Compression** and opt-in pagination (`?page=&limit=`) on the admin list endpoints
- **Reverse proxy** — Nginx + Docker Compose, two backend instances, sticky sessions, WebSocket upgrade support, live-verified (load distribution, failover, and the Socket.IO handshake all confirmed working through the proxy) — see [Horizontal Scaling & Reverse Proxy](#horizontal-scaling--reverse-proxy)
- **Frontend code splitting** — routes are lazy-loaded (`React.lazy` + `Suspense`) instead of shipping one monolithic bundle

## Architecture & Diagrams

### System Architecture

Two traffic patterns run side by side: REST for anything transactional (auth, profiles, bookings, uploads), and a Socket.IO server for anything real-time. Video itself never touches the server — Socket.IO only exchanges the SDP/ICE handshake, after which media flows directly between the two browsers. Socket.IO is Redis-backed (`@socket.io/redis-adapter`): `io.to(room).emit(...)` publishes through Redis instead of just broadcasting in-process, which is what lets chat and meeting events reach a client no matter which backend instance it's actually connected to — see [Horizontal Scaling](#horizontal-scaling--reverse-proxy) below.

```mermaid
flowchart TB
    subgraph Clients["React 19 + Vite — Browser"]
        C1["Patient / Doctor / Admin UI"]
        C2["Peer browser (call partner)"]
    end

    subgraph Server["Node.js + Express 5"]
        REST["REST routers<br/>admin, doctor, user, appointment,<br/>rating, bot, chat, report, skin"]
        CTRL["Controllers"]
        SVC["Services (business logic)"]
        SIO["Socket.IO server<br/>+ Redis adapter"]
    end

    DB[("MongoDB<br/>via Mongoose")]
    REDIS[("Redis<br/>Socket.IO pub/sub<br/>+ rate-limit store")]
    CLOUD[("Cloudinary<br/>media + certificates")]
    MAIL(["Nodemailer<br/>Gmail SMTP"])
    GEMINI(["Google Gemini<br/>gemini-2.5-flash"])
    STUN{{"STUN<br/>stun.l.google.com:19302"}}

    C1 -->|"REST / axios"| REST
    REST --> CTRL --> SVC --> DB
    SVC --> CLOUD
    SVC --> MAIL
    SVC --> GEMINI

    C1 -.->|"socket.io-client<br/>auth handshake"| SIO
    C2 -.->|"socket.io-client"| SIO
    SIO --> DB
    SIO <-.->|"pub/sub"| REDIS

    C1 <==>|"WebRTC media<br/>P2P after signaling"| C2
    C1 -.->|"ICE"| STUN
    C2 -.->|"ICE"| STUN
```

### Horizontal Scaling & Reverse Proxy

The backend runs as two (or more) identical instances behind Nginx, load-balanced with sticky sessions. Neither instance holds any state that the other doesn't also have access to — auth is stateless JWTs, and the only real-time in-memory-feeling state (chat rooms, meeting participant lists) actually lives in Redis via the Socket.IO adapter, not in either process's memory. That's what makes it safe to route a given client to either instance.

```mermaid
flowchart TB
    Client["Browser<br/>REST + Socket.IO client"]
    LB["Nginx reverse proxy<br/>ip_hash sticky sessions<br/>WebSocket upgrade headers"]
    B1["backend1<br/>Express + Socket.IO"]
    B2["backend2<br/>Express + Socket.IO"]
    Mongo[("MongoDB Atlas<br/>shared")]
    Redis[("Redis<br/>shared pub/sub")]

    Client -->|":80 HTTP / WS"| LB
    LB -->|"sticky by client IP"| B1
    LB -->|"sticky by client IP"| B2
    B1 --> Mongo
    B2 --> Mongo
    B1 <-.->|"pub/sub"| Redis
    B2 <-.->|"pub/sub"| Redis
```

Config lives in `docker-compose.yml` and `nginx/nginx.conf` at the repo root — see [Deployment](#deployment) for how to run it.

### Module Layering (UML)

Every feature module follows the same Router → Controller → Service → Model layering. The appointment module is the most interesting instance of it, because it carries two independent creation paths — a legacy admin-approved request, and a newer self-serve slot booking — that write to two different collections.

```mermaid
classDiagram
    class Router {
        <<layer>>
        HTTP endpoints, auth middleware
    }
    class Controller {
        <<layer>>
        thin request or response glue
    }
    class Service {
        <<layer>>
        business logic
    }
    class Model {
        <<layer>>
        Mongoose schema
    }
    Router --> Controller
    Controller --> Service
    Service --> Model
```

```mermaid
classDiagram
    class AppointRouter {
        +POST appointrequest()
        +GET viewappointment()
        +PUT appointmentstatus()
        +POST approveappointment()
        +GET available-slots()
        +POST book-slot()
    }
    class AppointmentService {
        +createRequest()
        +updateStatus()
        +approveAppointment()
        +generateTimeSlots()
        +bookSlot()
    }
    class AppointmentModel {
        +String userid
        +String doctorid
        +String date
        +String time
    }
    class AppointmentRequestModel {
        +String userid
        +String doctorid
        +String status
    }

    AppointRouter --> AppointmentService : delegates
    AppointmentService --> AppointmentModel : persists, appointmentnew
    AppointmentService --> AppointmentRequestModel : persists, appointmentrequest
```

### Auth & Role Routing

There is no shared session concept — three roles, three cookies, three JWT middlewares, each independently checking the same `JWT_SECRET` against its own collection.

```mermaid
flowchart LR
    L["Login.jsx<br/>role selector"] -->|"admin"| LA["POST /adminlogin"]
    L -->|"doctor"| LD["POST /doctorlogin"]
    L -->|"user"| LU["POST /userlogin"]

    LA --> JA["JWT signed<br/>Set-Cookie: emtoken"]
    LD --> JD["JWT signed<br/>Set-Cookie: emstoken"]
    LU --> JU["JWT signed<br/>Set-Cookie: token"]

    JA --> MA["middleware/admin.js<br/>reads emtoken"]
    JD --> MD["middleware/doctor.js<br/>reads emstoken"]
    JU --> MU["middleware/user.js<br/>reads token"]

    MA --> RA["Admindashboard, Viewdoctor,<br/>Viewusers, ViewAppointment"]
    MD --> RD["Doctordashboard, doctorviewapp,<br/>doctorchat, meeting"]
    MU --> RU["Userdashboard, userviewapp,<br/>SlotBooking, meeting"]
```

### Core Data Flows

**A · Patient registration (OTP-gated)**

```mermaid
sequenceDiagram
    actor U as Patient
    participant API as userrouter
    participant Svc as userservice
    participant Pending as PendingUser
    participant Mail as Nodemailer
    participant DB as user

    U->>API: POST /userregister
    API->>Svc: registeruser()
    Svc->>Svc: bcrypt hash + generate OTP
    Svc->>Pending: upsert, TTL 10 min
    Svc->>Mail: send OTP email
    Mail-->>U: OTP delivered
    API-->>U: 200 OTP sent

    U->>API: POST /userregisterverify
    API->>Svc: verifyOtp()
    Svc->>Pending: find by email and otp
    Svc->>DB: create user document
    Svc->>Pending: delete pending doc
    API-->>U: 200 account created

    U->>API: POST /userlogin
    API->>Svc: login()
    Svc->>DB: find by email
    Svc->>Svc: compare hash, check userstatus
    Svc-->>API: sign JWT, 1 hour expiry
    API-->>U: Set-Cookie token
```

**B · Doctor onboarding (admin-gated)**

```mermaid
sequenceDiagram
    actor D as Doctor applicant
    actor A as Admin
    participant API as doctorrouter
    participant Cloud as Cloudinary
    participant Perm as permission
    participant DocDB as doctor
    participant Mail as Nodemailer

    D->>API: POST /doctorpermission, multipart + certificate
    API->>Cloud: upload certificate, raw
    Cloud-->>API: secure_url
    API->>Perm: create doc, permission pending
    API-->>D: 200 request submitted

    A->>API: GET /doctorrequest
    API->>Perm: find pending applications
    Perm-->>A: pending list

    A->>API: PUT /doctorpermissionupdate
    API->>Perm: set permission approved

    A->>API: POST /doctorregister
    API->>DocDB: create doctor, random password
    API->>Mail: email credentials
    Mail-->>D: login email + password
```

**C · Appointment booking — two parallel paths**

```mermaid
flowchart TD
    Start(["Patient wants an appointment"])
    Start --> Choice{"Which flow?"}

    Choice -->|"Legacy request"| Req["POST /appointrequest<br/>creates appointmentrequest<br/>status pending"]
    Req --> AdminReview["Admin<br/>PUT /appointmentstatus<br/>approve or reject"]
    AdminReview --> Manual["Admin or frontend<br/>POST /approveappointment<br/>date and time supplied manually"]
    Manual --> Real[("appointment collection<br/>appointmentnew")]

    Choice -->|"Self-serve slots"| Avail["GET /available-slots<br/>generateTimeSlots minus booked times"]
    Avail --> Pick["Patient picks a free slot"]
    Pick --> Book["POST /book-slot<br/>revalidate + insert"]
    Book --> Real

    Real --> Chat["Enables chat<br/>user + doctor pair"]
    Real --> Meeting["Enables /meeting/:appointmentId<br/>WebRTC authorization"]
```

**D · Video consultation (WebRTC signaling)**

```mermaid
sequenceDiagram
    actor P as Patient
    actor Dr as Doctor
    participant IO as meetingSocket.js
    participant DB as appointment

    P->>IO: connect, auth token + role
    IO->>IO: JWT verify, io.use middleware
    P->>IO: join-meeting, appointmentId
    IO->>DB: findById appointmentId
    IO->>IO: check isAuthorized + hasMeetingStarted
    IO-->>P: joined-meeting, selfId, peers empty

    Dr->>IO: connect + join-meeting, appointmentId
    IO->>DB: findById + verify
    IO-->>Dr: joined-meeting, selfId, peers has P
    IO-->>P: peer-joined, Dr

    P->>P: new RTCPeerConnection, create offer
    P->>IO: signal, type offer, sdp
    IO->>Dr: relay signal, room-scoped
    Dr->>Dr: setRemoteDescription, create answer
    Dr->>IO: signal, type answer, sdp
    IO->>P: relay signal

    P->>IO: signal, type candidate
    IO->>Dr: relay ICE candidate
    Dr->>IO: signal, type candidate
    IO->>P: relay ICE candidate

    Note over P,Dr: STUN-assisted P2P media. No TURN configured.

    Dr->>IO: leave-meeting or disconnect
    IO-->>P: peer-left
    P->>P: pc.close()
```

**E · Real-time chat**

```mermaid
sequenceDiagram
    actor U as User
    actor D as Doctor
    participant IO as chatSocket.js
    participant DB as message

    U->>IO: GET /chat/user/history/doctorId
    IO-->>U: prior messages

    U->>IO: joinConversation, userId, doctorId
    IO->>IO: join room chat_userId_doctorId
    D->>IO: joinConversation, userId, doctorId
    IO->>IO: join same room

    U->>IO: sendMessage, userId, doctorId, text
    IO->>DB: saveMessage()
    IO-->>U: receiveMessage, room broadcast
    IO-->>D: receiveMessage, room broadcast
```

**F · AI features**

```mermaid
flowchart LR
    subgraph Bot["Chatbot"]
        B1["bot.jsx"] -->|"POST /chat"| B2["Gemini 2.5 Flash"]
        B2 --> B1
    end

    subgraph Report["Medical report analysis"]
        R1["ReportAnalysis.jsx<br/>upload PDF or image"] -->|"POST /report"| R2["Gemini: summarize"]
        R2 --> R3[("Cloudinary: file")]
        R2 --> R4[("report doc<br/>messages array")]
        R5["Follow-up question"] -->|"POST /report<br/>text + reportId"| R2
    end

    subgraph Skin["Skin analysis"]
        S1["LiveCapture.jsx<br/>webcam canvas, every 5s"] -->|"POST /skin-analysis"| S2["Gemini: analyze frame"]
        S2 --> S1
    end
```

### Data Model (ER Diagram)

Mongoose enforces almost none of these relationships — `report → user` is the one real `ref`. Everything else is a logical foreign key: a plain string or ObjectId field joined by hand in application code, drawn here as if it were enforced because that's how the app actually uses it. `otps` and `pendingusers` are TTL-expiring staging collections, not core domain entities; `ADMIN` is a singleton — registration only succeeds while the collection is empty.

```mermaid
erDiagram
    USER ||--o{ APPOINTMENT : books
    DOCTOR ||--o{ APPOINTMENT : accepts
    USER ||--o{ APPOINTMENT_REQUEST : submits
    DOCTOR ||--o{ APPOINTMENT_REQUEST : receives
    USER ||--o{ MESSAGE : sends
    DOCTOR ||--o{ MESSAGE : sends
    USER ||--o{ DOCTOR_RATING : writes
    DOCTOR ||--o{ DOCTOR_RATING : receives
    USER ||--o{ REPORT : owns
    DOCTOR ||--o{ PERMISSION : "applies as, by email"

    USER {
        ObjectId _id
        string email
        string password
        string name
        string userstatus
        string bloodGroup
    }
    DOCTOR {
        ObjectId _id
        string email
        string password
        string name
        string specialization
        string doctorstatus
    }
    ADMIN {
        ObjectId _id
        string email
        string password
    }
    PERMISSION {
        ObjectId _id
        string email
        string certificate
        string permission
    }
    APPOINTMENT {
        ObjectId _id
        string userid
        string doctorid
        string date
        string time
    }
    APPOINTMENT_REQUEST {
        ObjectId _id
        string userid
        string doctorid
        string status
    }
    MESSAGE {
        ObjectId _id
        string userId
        string doctorId
        string senderRole
        string text
    }
    DOCTOR_RATING {
        ObjectId _id
        string userId
        string doctorId
        number rating
    }
    REPORT {
        ObjectId _id
        ObjectId user
        string title
        string fileUrl
    }
    OTP {
        string email
        string role
        string otp
    }
    PENDING_USER {
        string email
        string password
        string otp
    }
```

## Project Structure

```
health/
├── docker-compose.yml         # Two backend instances + Nginx, for horizontal scaling
├── nginx/
│   └── nginx.conf              # Reverse proxy: sticky sessions, WebSocket upgrade, passive health checks
├── Backend/
│   ├── index.js               # Express app entry point — health check, graceful shutdown, CORS, compression
│   ├── dbconnection.js        # MongoDB connection
│   ├── Dockerfile              # Node 22 Alpine
│   ├── config/                 # Cloudinary, CORS origins (config/corsOrigins.js), Redis client (config/redisClient.js)
│   ├── router/                 # Route definitions (admin, doctor, user, appointment, chat, rating, bot, report, skin analysis)
│   ├── controller/             # Request handlers
│   ├── service/                 # Business logic (chat, appointments, ratings, AI services)
│   ├── model/                   # Mongoose schemas (User, Doctor, Admin, Appointment, Message, OTP, ...)
│   ├── middleware/              # JWT auth per role, Multer upload config, Redis-backed rate limiting
│   └── socket/                  # Socket.IO handlers (chatSocket, meetingSocket/WebRTC signaling) — Redis-adapter backed
├── Frontend/
│   └── src/
│       ├── pages/               # Route-level pages (dashboards, chat, appointments, meeting, etc.) — lazy-loaded
│       ├── components/          # Shared components & layouts (AdminLayout, DoctorLayout, UserLayout, private routes)
│       └── socket.js            # Socket.IO client setup
└── docs/
    └── live.md                 # Deep-dive on the live-capture AI pipeline
```

## Getting Started

### Prerequisites
- Node.js 20.19+ (required by mongoose/mongodb-driver's use of the global Web Crypto API — Node 18 will fail to connect to MongoDB with `crypto is not defined`)
- A MongoDB instance (local or Atlas)
- A Cloudinary account (media uploads)
- A Google Gemini API key
- An SMTP-capable email account (for OTP emails)

### Backend setup

```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email_address
PASS_KEY=your_email_app_password
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
CORS_ORIGINS=http://localhost:5173,https://auraahealth.vercel.app
REDIS_URL=rediss://default:password@your-cloud-redis-host:port
```

`REDIS_URL` backs the Socket.IO Redis adapter (chat + meeting signaling) — required so real-time events reach the right client no matter which server instance it's connected to. Any cloud Redis works (Upstash, Redis Cloud, ElastiCache, ...); use `rediss://` if the provider requires TLS, `redis://` otherwise. The server won't start without it.

Run the server:

```bash
npm run dev    # nodemon, for local development
npm start      # production
```

### Frontend setup

```bash
cd Frontend
npm install
```

Create a `.env` file in `Frontend/`:

```env
VITE_API_URL=http://localhost:5000
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

> Note: CORS origins are read from `CORS_ORIGINS` (comma-separated) in `Backend/.env`, shared by both the REST API (`index.js`) and the Socket.IO server (`socket/chatSocket.js`) via `config/corsOrigins.js`. Defaults to the deployed frontend URL if unset — add your local dev origin (e.g. `http://localhost:5173`) to run against a local frontend.

## Deployment

- **Frontend** is deployed to Vercel.
- **Backend** ships with a `Dockerfile` (Node 22 Alpine) exposing port `5000`, and a `docker-compose.yml` + `nginx/nginx.conf` at the repo root that run two backend instances behind an Nginx reverse proxy — the setup this app needs for horizontal scaling.

### Running the backend behind Nginx

See [Horizontal Scaling & Reverse Proxy](#horizontal-scaling--reverse-proxy) above for the architecture — this is the actual command sequence to run it.

**On the VM (EC2/VPS) that will run the backend:**

```bash
git clone <this repo> && cd health
# Backend/.env must exist here with production values (MONGO_URI, JWT_SECRET,
# REDIS_URL, CORS_ORIGINS pointed at your real frontend origin, etc.)
docker compose up -d --build
```

That builds `backend1` and `backend2` from `Backend/Dockerfile`, and starts Nginx listening on port 80, proxying to whichever instance is healthy (`ip_hash` sticky sessions, passive health checks via `max_fails`/`fail_timeout`). Open port 80 (and 443, once TLS is set up) in the VM's security group / firewall.

**Verify traffic is actually being distributed** — the `/healthz` route reports its own container hostname, so hitting it repeatedly through Nginx should alternate between instances:

```bash
for i in $(seq 1 10); do curl -s http://<your-vm-ip>/healthz; echo; done
# {"status":"ok","db":"connected","instance":"<backend1 container id>"}
# {"status":"ok","db":"connected","instance":"<backend2 container id>"}
# ...
```

Scale further by adding a `backend3`, etc. to `docker-compose.yml` (same shape as `backend1`) and adding it to the `upstream backend_pool` block in `nginx/nginx.conf`.

**TLS**: the Nginx config here only handles plain HTTP (port 80). For production HTTPS, point a real domain's DNS at the VM's IP and run [certbot](https://certbot.eff.org/)'s Nginx plugin on the host — it edits `nginx.conf` in place to add a `443` server block and handles certificate renewal. That step needs an actual domain name, so it's left for you to run once one is pointed here.

**Update the frontend** once this is live: set `VITE_API_URL` (in `Frontend/.env`, and in Vercel's env vars for the deployed site) to the VM's domain/IP instead of `localhost:5000`, and make sure `CORS_ORIGINS` in `Backend/.env` includes the deployed frontend's actual origin.

> Verified locally: `docker compose up --build` brings up both instances and Nginx cleanly, `/healthz` confirms requests land on different container instances, a real API route (`/viewdoctors`) round-trips through the proxy to MongoDB, and the Engine.IO handshake (`/socket.io/?EIO=4&transport=polling`) responds correctly — the path chat and video signaling depend on. Nginx failover was also confirmed by stopping one instance mid-test and watching sticky sessions/round-robin route around it.

## Documentation

- [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) — complete, file-by-file map of the repository (Backend and Frontend), plus the router → controller → service layering and a few structural notes on stub/legacy files.
- [docs/live.md](docs/live.md) — walkthrough of the live-capture pipeline (webcam capture → Socket.IO → server-side processing → real-time UI feedback). Note: this describes an earlier design; the implemented `LiveCapture.jsx` instead POSTs a frame to `/skin-analysis` for Gemini every 5s — see the note in `docs/PROJECT_STRUCTURE.md`.
