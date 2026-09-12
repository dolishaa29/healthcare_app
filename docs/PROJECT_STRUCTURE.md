# Project Structure

A complete, file-by-file map of the repository. For how these pieces behave at runtime (request/response flows, WebRTC signaling, auth), see the [Architecture & Diagrams](../README.md#architecture--diagrams) section of the root README — this document is the static map, that one is the dynamic one.

```
health/
├── README.md
├── docs/
│   ├── uml.md                           # Eight UML diagrams modeling the real routes/services/schemas
│   ├── PROJECT_STRUCTURE.md             # This file
│   └── INTERVIEW_PREP.md                # Tech-stack rationale, trade-offs, anticipated Q&A
├── Backend/
│   ├── index.js                         # Express app entry point — CORS, body parsing, mounts all routers, boots Socket.IO
│   ├── dbconnection.js                  # Mongoose connection setup
│   ├── Dockerfile                       # node:22-alpine, npm install --production, exposes :5000
│   ├── .dockerignore / .gitignore / .env
│   ├── package.json / package-lock.json
│   ├── config/
│   │   ├── cloudinary.js                # Cloudinary SDK config + uploadBuffer() helper (streams Multer buffers to Cloudinary)
│   │   ├── corsOrigins.js               # CORS_ORIGINS env parsed into an array, shared by REST + Socket.IO
│   │   ├── gemini.js                    # Google Generative AI SDK config, getModel() helper
│   │   └── redisClient.js               # Shared ioredis-style pub/sub client pair, used by the Socket.IO adapter and rate limiter
│   ├── router/                          # Express route definitions — one file per feature area. Every router calls its
│   │   │                                 # service module's exported functions directly as route handlers — there is no
│   │   │                                 # controller layer in this codebase (see "Backend layering" below).
│   │   ├── adminrouter.js               # Admin auth + dashboard
│   │   ├── doctorrouter.js              # Doctor auth, profile, onboarding, permission approval
│   │   ├── userrouter.js                # Patient auth + profile
│   │   ├── appointrouter.js             # Appointment requests + slot booking
│   │   ├── ratingrouter.js              # Doctor ratings
│   │   ├── botrouter.js                 # AI chatbot
│   │   ├── chatrouter.js                # Chat conversations/history
│   │   ├── reportanalysis.js            # AI medical report analysis
│   │   ├── skinanalysis.js              # AI skin analysis
│   │   ├── triagerouter.js              # AI symptom → specialization + urgency triage
│   │   └── hospitalrouter.js            # Nearby doctors (Mongo geospatial) + nearby hospitals (OSM Overpass API)
│   ├── service/                         # Request handlers + business logic — hashing, OTP, Cloudinary/Gemini/Nodemailer calls, DB queries
│   │   ├── adminservice.js
│   │   ├── doctorservice.js
│   │   ├── userservice.js
│   │   ├── appointment.js               # Both booking paths: appointmentrequest (legacy) and appointmentnew (slots)
│   │   ├── ratings.js
│   │   ├── botservice.js                # Gemini chatbot (incl. SSE streaming variant)
│   │   ├── reportanalysis.js            # Gemini report summarization + follow-up chat
│   │   ├── skinanalysis.js              # Gemini skin-frame analysis (stateless, no model backing it)
│   │   ├── triageservice.js             # Gemini symptom triage, cross-referenced against real doctor specializations
│   │   ├── hospitalservice.js           # Mongo 2dsphere geoNear + OSM Overpass API, merged into one response
│   │   └── chatservice.js               # Message persistence, used by socket/chatSocket.js
│   ├── model/                           # Mongoose schemas
│   │   ├── admin.js                     # admin collection — singleton, registration only succeeds while empty
│   │   ├── doctor.js                    # doctor collection — includes a 2dsphere geospatial index for nearby-doctor search
│   │   ├── user.js                      # user collection
│   │   ├── permission.js                # doctorpermissions collection — pre-doctor onboarding request
│   │   ├── Appointment/
│   │   │   ├── appointment.js           # appointmentnew collection — the real, scheduled appointment
│   │   │   └── appointrequest.js        # appointmentrequest collection — legacy admin-approval request
│   │   ├── Message.js                   # message collection — chat history
│   │   ├── doctorRating.js              # ratings collection
│   │   ├── report.js                    # report collection — only model with a real Mongoose ref (→ user)
│   │   ├── OTP.js                       # otps collection — TTL 600s, shared by user + doctor password reset
│   │   └── PendingUser.js               # pendingusers collection — TTL 600s, staging area before user creation
│   ├── middleware/
│   │   ├── admin.js                     # JWT guard, reads cookie emtoken → req.admin
│   │   ├── doctor.js                    # JWT guard, reads cookie emstoken → req.doctor
│   │   ├── user.js                      # JWT guard, reads cookie token → req.user
│   │   ├── optionalAuth.js              # Attaches req.user if a valid token cookie is present, never blocks the request
│   │   ├── rateLimit.js                 # Redis-backed per-IP limiters for the AI-cost routes (chat, skin, triage, hospital)
│   │   └── multer.js                    # Shared memory-storage Multer config (Cloudinary uploads) — used by every upload route
│   ├── socket/
│   │   ├── chatSocket.js                # Socket.IO server bootstrap + JWT handshake auth + chat events
│   │   └── meetingSocket.js             # WebRTC signaling relay (join/leave room, SDP/ICE forwarding)
│   └── public/                          # images/ and uploads/ are empty on a fresh clone (.gitkeep only) — actual media
│                                          # storage is Cloudinary; nothing in the app writes to local disk anymore
└── Frontend/
    ├── index.html
    ├── vite.config.js
    ├── eslint.config.js                 # ESLint 9 flat config
    ├── package.json / package-lock.json
    ├── .env / .gitignore / README.md
    ├── public/
    │   ├── favicon.svg
    │   └── health.jfif
    └── src/
        ├── main.jsx                      # React root render
        ├── App.jsx                       # All routing — public, admin, doctor, and user route groups
        ├── App.css / index.css           # Global styles (Tailwind v4 entry)
        ├── socket.js                     # getSocket(token, role) — lazy Socket.IO client singleton
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
        │       ├── Hero.jsx / FeatureShowcase.jsx / HowItWorks.jsx / Roles.jsx
        │       ├── Pricing.jsx / FAQ.jsx / Contact.jsx / Resources.jsx
        │       ├── Footer.jsx / Navbar.jsx / Reveal.jsx / useInView.js
        └── pages/
            ├── Landing.jsx                # Public marketing homepage (/)
            ├── Login.jsx                  # Single form; role selector switches endpoint + cookie
            ├── Userregister.jsx / Doctorregister.jsx / Adminregister.jsx  (Adminregister is routed at /admin-setup — see note below)
            ├── ForgotPassword.jsx / Changepassuser.jsx / changepassworddoc.jsx
            ├── Admindashboard.jsx / Viewusers.jsx / Viewuserall.jsx
            ├── Viewdoctors.jsx / Doctorrequest.jsx / Approved.jsx / RejectedDoctors.jsx
            ├── ViewAppointment.jsx        # Admin — all appointment requests
            ├── Docterdashboard.jsx / DoctorProfile.jsx / Doctorviewapp.jsx
            ├── ProfileDocterForAll.jsx    # Public doctor profile view (/doctorprofileview/:id)
            ├── DoctorChat.jsx / UserChat.jsx
            ├── Userdashboard.jsx / Userviewapp.jsx / UserProfile.jsx
            ├── ViewDoctor.jsx             # Patient-facing doctor search/listing
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
            ├── NearbyHospitals.jsx        # Geolocation-based doctor + hospital search
            └── Rating.jsx                 # Patient rates a doctor
```

## Backend layering

Every feature area follows **Router → Service → Model**. There is no controller layer anywhere in this codebase — each router imports its service module's functions and wires them directly as Express route handlers:

| Router | Service |
|---|---|
| `adminrouter.js` | `adminservice.js` |
| `doctorrouter.js` | `doctorservice.js` |
| `userrouter.js` | `userservice.js` |
| `appointrouter.js` | `appointment.js` |
| `ratingrouter.js` | `ratings.js` |
| `chatrouter.js` | `chatservice.js` |
| `botrouter.js` | `botservice.js` |
| `reportanalysis.js` | `reportanalysis.js` |
| `skinanalysis.js` | `skinanalysis.js` |
| `triagerouter.js` | `triageservice.js` |
| `hospitalrouter.js` | `hospitalservice.js` |

## Structural notes

- **`Backend/public/images/`** and **`Backend/public/uploads/`** are empty on a fresh clone (`.gitkeep` only, gitignored otherwise) — all media (profile pictures, doctor certificates, report files) goes through Cloudinary via the shared memory-storage Multer config in `middleware/multer.js`. They previously also held unrelated committed files (screenshots, personal photos, unrelated PDFs) from a router that used local disk storage inconsistently with the rest of the app — cleaned up, and that router now uses the same shared Multer config as everything else.
- **Admin bootstrap** (`Adminregister.jsx`, routed at `/admin-setup`) only succeeds once — `adminservice.js#adminregister` checks that the `admin` collection is empty before creating a record, so it's safe to leave reachable; hitting it again just reports "admin already registered."
- **`/meeting/:appointmentId`** (`Meeting.jsx`) is declared twice in `App.jsx`, once under the doctor route group and once under the user group, reusing the same component for both roles.
