# Project Structure

A complete, file-by-file map of the repository. For how these pieces behave at runtime (request/response flows, WebRTC signaling, auth), see the [Architecture & Diagrams](../README.md#architecture--diagrams) section of the root README — this document is the static map, that one is the dynamic one.

```
health/
├── README.md
├── docs/
│   ├── live.md                          # Deep-dive doc — describes an aspirational pipeline, see note below
│   └── PROJECT_STRUCTURE.md             # This file
├── Backend/
│   ├── index.js                         # Express app entry point — CORS, body parsing, mounts all routers, boots Socket.IO
│   ├── dbconnection.js                  # Mongoose connection setup
│   ├── Dockerfile                       # node:18-alpine, npm install --production, exposes :5000
│   ├── .dockerignore / .gitignore / .env
│   ├── package.json / package-lock.json
│   ├── config/
│   │   └── cloudinary.js                # Cloudinary SDK config + uploadBuffer() helper (streams Multer buffers to Cloudinary)
│   ├── router/                          # Express route definitions — one file per feature area
│   │   ├── adminrouter.js               # Admin auth + dashboard
│   │   ├── doctorrouter.js              # Doctor auth, profile, onboarding, permission approval
│   │   ├── userrouter.js                # Patient auth + profile
│   │   ├── appointrouter.js             # Appointment requests + slot booking
│   │   ├── ratingrouter.js              # Doctor ratings
│   │   ├── botrouter.js                 # AI chatbot (calls service/botservice.js directly, no controller)
│   │   ├── chatrouter.js                # Chat conversations/history
│   │   ├── reportanalysis.js            # AI medical report analysis (calls service directly, no controller)
│   │   └── skinanalysis.js              # AI skin analysis (calls service directly, no controller)
│   ├── controller/                      # Thin request/response glue — one per role/domain (bot, report, skin skip this layer)
│   │   ├── admincontroller.js
│   │   ├── doctorcontroller.js
│   │   ├── usercontroller.js
│   │   ├── appointmentcontroller.js
│   │   ├── chatcontroller.js
│   │   └── ratingcontroller.js
│   ├── service/                         # Business logic — hashing, OTP, Cloudinary/Gemini/Nodemailer calls, DB queries
│   │   ├── adminservice.js
│   │   ├── doctorservice.js
│   │   ├── userservice.js
│   │   ├── appointment.js               # Both booking paths: appointmentrequest (legacy) and appointmentnew (slots)
│   │   ├── ratings.js
│   │   ├── botservice.js                # Gemini chatbot
│   │   ├── reportanalysis.js            # Gemini report summarization + follow-up chat
│   │   ├── skinanalysis.js              # Gemini skin-frame analysis (stateless, no model backing it)
│   │   └── chatservice.js               # Message persistence, used by socket/chatSocket.js
│   ├── model/                           # Mongoose schemas
│   │   ├── admin.js                     # admin collection — singleton
│   │   ├── doctor.js                    # doctor collection
│   │   ├── user.js                      # user collection
│   │   ├── permission.js                # doctorpermissions collection — pre-doctor onboarding request
│   │   ├── Appointment/
│   │   │   ├── appointment.js           # appointmentnew collection — the real, scheduled appointment
│   │   │   └── appointrequest.js        # appointmentrequest collection — legacy admin-approval request
│   │   ├── Message.js                   # message collection — chat history
│   │   ├── doctorRating.js              # ratings collection
│   │   ├── report.js                    # report collection — only model with a real Mongoose ref (→ user)
│   │   ├── OTP.js                       # otps collection — TTL 600s, shared by user + doctor password reset
│   │   ├── PendingUser.js               # pendingusers collection — TTL 600s, staging area before user creation
│   │   └── skinanalysis.js              # empty file — no schema; skin analysis persists nothing
│   ├── middleware/
│   │   ├── admin.js                     # JWT guard, reads cookie emtoken → req.admin
│   │   ├── doctor.js                    # JWT guard, reads cookie emstoken → req.doctor
│   │   ├── user.js                      # JWT guard, reads cookie token → req.user
│   │   └── multer.js                    # Shared memory-storage Multer config (Cloudinary uploads)
│   ├── socket/
│   │   ├── chatSocket.js                # Socket.IO server bootstrap + JWT handshake auth + chat events
│   │   └── meetingSocket.js             # WebRTC signaling relay (join/leave room, SDP/ICE forwarding)
│   └── public/images/                   # Legacy local upload target — also contains unrelated stray files (see note below)
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js                 # ESLint 9 flat config
    ├── package.json / package-lock.json
    ├── .env / .gitignore / README.md
    ├── public/
    │   ├── health.jfif
    │   └── vite.svg
    └── src/
        ├── main.jsx                      # React root render
        ├── App.jsx                       # All routing — public, admin, doctor, and user route groups
        ├── App.css / index.css           # Global styles (Tailwind v4 entry)
        ├── socket.js                     # getSocket(token, role) — lazy Socket.IO client singleton
        ├── assets/
        │   └── react.svg
        ├── components/
        │   ├── AdminLayout.jsx           # Sidebar shell + <Outlet/> for admin routes
        │   ├── DoctorLayout.jsx          # Sidebar shell + <Outlet/> for doctor routes
        │   ├── UserLayout.jsx            # Sidebar shell + <Outlet/> for patient routes
        │   ├── priroutes.jsx             # Route guard — admin (checks cookie emtoken)
        │   ├── Doctorpri.jsx             # Route guard — doctor (checks cookie emstoken)
        │   ├── Userpri.jsx               # Route guard — user (checks cookie token)
        │   ├── ChatWindow.jsx            # Shared chat UI — used by both UserChat and DoctorChat pages
        │   ├── DoctorCard.jsx            # Doctor list/search result card
        │   ├── bot.jsx                   # Gemini chatbot widget
        │   └── landing/                  # Marketing page sections, assembled by pages/Landing.jsx
        │       ├── Hero.jsx / CTA.jsx / FeatureShowcase.jsx / HowItWorks.jsx
        │       ├── Roles.jsx / ComparisonTable.jsx / Pricing.jsx / FAQ.jsx
        │       ├── Contact.jsx / About.jsx / Privacy.jsx / Resources.jsx
        │       ├── Footer.jsx / Navbar.jsx / Reveal.jsx / useInView.js
        └── pages/
            ├── Landing.jsx                # Public marketing homepage (/)
            ├── Login.jsx                  # Single form; role selector switches endpoint + cookie
            ├── Userregister.jsx / Doctorregister.jsx / Adminregister.jsx
            ├── ForgotPassword.jsx / Changepassuser.jsx / changepassworddoc.jsx
            ├── Admindashboard.jsx / Viewusers.jsx / Viewuserall.jsx
            ├── Viewdoctors.jsx / Doctorrequest.jsx / Approved.jsx / RejectedDoctors.jsx
            ├── ViewAppointment.jsx        # Admin — all appointment requests
            ├── Docterdashboard.jsx / DoctorProfile.jsx / Doctorviewapp.jsx
            ├── ProfileDocterForAll.jsx    # Public doctor profile view (/doctorprofileview/:id)
            ├── DoctorChat.jsx / UserChat.jsx
            ├── Userdashboard.jsx / Userviewapp.jsx / UserProfile.jsx
            ├── ViewDoctor.jsx             # Patient-facing doctor search/listing
            ├── Appointment.jsx            # Legacy appointment request form
            ├── SlotBooking/               # Self-serve booking wizard
            │   ├── index.jsx              # Step orchestrator
            │   ├── DoctorSearchStep.jsx
            │   ├── DateSlotStep.jsx
            │   ├── BookingConfirmStep.jsx
            │   ├── SuccessScreen.jsx
            │   └── utils.js
            ├── Meeting.jsx                # WebRTC video call page — shared by doctor + user routes
            ├── ReportAnalysis.jsx         # AI medical report upload + chat
            ├── LiveCapture.jsx            # AI skin analysis — webcam capture every 5s
            ├── Rating.jsx                 # Patient rates a doctor
            ├── Feedback.jsx               # Stub — not routed in App.jsx, no implementation yet
            └── ViewFeedback.jsx           # Stub — not routed in App.jsx, no implementation yet
```

## Backend layering

Most feature areas follow **Router → Controller → Service → Model**. Three routers skip the controller layer entirely and call their service directly:

| Router | Controller | Service |
|---|---|---|
| `adminrouter.js` | `admincontroller.js` | `adminservice.js` |
| `doctorrouter.js` | `doctorcontroller.js` | `doctorservice.js` |
| `userrouter.js` | `usercontroller.js` | `userservice.js` |
| `appointrouter.js` | `appointmentcontroller.js` | `appointment.js` |
| `ratingrouter.js` | `ratingcontroller.js` | `ratings.js` |
| `chatrouter.js` | `chatcontroller.js` | `chatservice.js` |
| `botrouter.js` | *(none)* | `botservice.js` |
| `reportanalysis.js` | *(none)* | `reportanalysis.js` |
| `skinanalysis.js` | *(none)* | `skinanalysis.js` |

`userrouter.js` and `doctorrouter.js` also import a couple of functions (`blockuser`/`updateuser`, `blockdoctor`) straight from their service, bypassing the controller for just those routes — the rest of each router goes through its controller as usual.

## Structural notes

- **`Backend/public/images/`** is a legacy disk-upload target that also has unrelated files committed to it (screenshots, personal photos, unrelated PDFs) — not part of the application's actual media pipeline, which now runs through Cloudinary.
- **`model/skinanalysis.js`** is an empty file. Skin analysis has no schema and persists nothing.
- **`pages/Feedback.jsx`** and **`pages/ViewFeedback.jsx`** are empty stub components with no markup and no route in `App.jsx` — scaffolded but not wired up. `Rating.jsx` is the feature that's actually live.
- **`docs/live.md`** documents a TensorFlow.js/coco-ssd pipeline that doesn't match the implemented `LiveCapture.jsx` (which POSTs a JPEG frame to `/skin-analysis` for Gemini every 5s) — treat it as aspirational, not as-built.
- **`/meeting/:appointmentId`** (`Meeting.jsx`) is declared twice in `App.jsx`, once under the doctor route group and once under the user group, reusing the same component for both roles.
