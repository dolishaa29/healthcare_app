# Interview Prep — Aura Health

Everything here is written to be defensible under cross-questioning: not just *what* was used, but *why*, what the alternative would have cost, and what's honestly still weak. Read this alongside [`../README.md`](../README.md) (architecture diagrams) and [`uml.md`](uml.md) (the eight UML views) — this document is the "why + how to defend it" layer; those are the "what" layer.

## Contents

1. [30-Second Pitch](#1-30-second-pitch)
2. [Tech Stack — Why This, Not That](#2-tech-stack--why-this-not-that)
3. [Core Design Decisions, Explained](#3-core-design-decisions-explained)
4. [Numbers & Facts Cheat Sheet](#4-numbers--facts-cheat-sheet)
5. [Known Limitations — Own Them Before They're Asked](#5-known-limitations--own-them-before-theyre-asked)
6. [Hard Questions, Prepared Answers](#6-hard-questions-prepared-answers)
7. [If Asked to Open the Code Live](#7-if-asked-to-open-the-code-live)

---

## 1. 30-Second Pitch

Aura Health is a full-stack telemedicine platform with three role-based portals — patient, doctor, admin. Patients book appointments (two different booking flows), chat and video-call their doctor over WebRTC, and use three separate Gemini-powered AI tools (symptom chatbot, medical report analysis, skin analysis). Doctors go through an admin-approved onboarding flow with certificate upload. The backend runs as two Node/Express instances behind an Nginx load balancer, with Redis backing both Socket.IO (so chat/video signaling work correctly no matter which instance a client lands on) and rate limiting. MongoDB is the primary datastore, Cloudinary holds all media, and the frontend is a Vite-built React 19 SPA deployed to Vercel.

---

## 2. Tech Stack — Why This, Not That

The rule for every row: pick the option below, know the honest trade-off it made, and be ready to say what you'd swap in if the constraint changed.

| Layer | Chosen | Why | Alternatives considered — why not (here, now) |
|---|---|---|---|
| Frontend framework | React 19 + Vite | Pure client-rendered SPA behind role-gated routes — only the landing page is public, so there's no SEO/SSR need that would justify Next.js's extra complexity. Vite's dev server + HMR is materially faster than CRA (which is deprecated anyway). | **Next.js** — SSR/SSG buys nothing when almost every route requires auth; it would add a server runtime and routing model this app doesn't need. **Angular** — heavier framework/DI ceremony for a team already fluent in plain React. |
| Routing | React Router v7 | Full manual control over three parallel route groups (admin/doctor/user), each wrapped in its own layout + guard component, with `React.lazy` per route for code splitting. | Framework-level routing (Next/Remix) assumes file-based routes and its own data-loading conventions — a worse fit for three independent, differently-authenticated route trees. |
| Styling | Tailwind CSS v4 | Utility-first means no naming/BEM overhead across ~50 page components; v4's Vite plugin (`@tailwindcss/vite`) compiles faster than the old PostCSS pipeline. | **CSS Modules / styled-components** — more boilerplate per component for a UI this size, and styled-components' runtime cost is pure downside once you're not doing dynamic per-prop theming. **MUI/Chakra** — pulls in a full component library and design language the app doesn't want to inherit. |
| Client state | Component-local `useState`, no global store | Every page fetches its own data on mount; nothing is shared cross-page except the auth token, which lives in a cookie (not React state) so it survives reloads for free. | **Redux/Zustand** — would be justified the moment two unrelated pages need to share live state (e.g. a notification badge count) without prop drilling or a refetch. Today nothing does. If asked "what would you add for a v2": Zustand over Redux — less boilerplate, no need for Redux's action/reducer ceremony for what would likely be a handful of small stores. |
| HTTP client | Axios | Interceptors (useful for attaching the auth header/handling 401s centrally), automatic JSON parsing, cleaner rejection handling on non-2xx than raw `fetch`. | `fetch` — fine, but you re-implement interceptor-equivalent logic by hand for every call site. |
| Backend runtime | Node.js + Express 5 | Same language as the frontend (one mental model, shared JSON contracts, no context-switching). Express is intentionally unopinionated — a good fit for a fast-moving `router → service → model` structure without DI/decorator overhead. Express 5 specifically for its native async-error handling (rejected promises in handlers propagate to error middleware automatically — no need to wrap every handler in a try/catch-and-`next`). | **NestJS** — DI, decorators, and modules are real value at a much bigger team/codebase size; here they'd be pure ceremony. **Fastify** — faster raw throughput, but the ecosystem (Socket.IO, rate-limit-redis, existing middleware patterns) is more Express-native. **Django/Spring** — different language than the frontend, no shared code/types. |
| Database | MongoDB + Mongoose | The domain is document-shaped, not strictly relational: doctor profiles have many optional/variable fields, chat messages and report follow-ups are naturally embedded/array-shaped, and schemas evolved fast during development without migrations. MongoDB's native `2dsphere` geospatial index powers "nearby doctors" with zero extra infrastructure (no PostGIS). | **PostgreSQL** — would give real foreign-key constraints and transactions across `user`/`doctor`/`appointment` (today those relationships are plain string/ObjectId fields joined by application code, not enforced by the DB — a genuine trade-off, see [§5](#5-known-limitations--own-them-before-theyre-asked)). Postgres is the honest answer to "what would you use if this had to be airtight-consistent at scale." |
| Real-time transport | Socket.IO (+ `@socket.io/redis-adapter`) | Automatic reconnection and long-poll fallback when WebSocket is blocked, and a room abstraction that maps directly onto "one room per chat conversation" and "one room per meeting" — exactly the primitive this app needs twice. The Redis adapter was added specifically because the backend runs as **two instances** behind Nginx: without it, `io.to(room).emit()` only reaches sockets connected to *that* process, so a user on `backend1` chatting with a doctor on `backend2` would never see the message. | **Raw WebSocket** — no reconnection/fallback/room semantics for free; would mean reimplementing all of that. **Firebase Realtime DB / Pusher** — managed, but means patient-doctor chat and video-signaling metadata pass through a third party, plus ongoing per-connection cost; self-hosting keeps it in the same infra as everything else and next to the same Mongo data the authorization checks need. |
| Video calls | WebRTC, peer-to-peer, STUN-only, signaled over the existing Socket.IO connection | Media never touches the server — zero video-bandwidth cost, and no third party sees patient-doctor video. Reusing Socket.IO for signaling (SDP/ICE exchange) avoided standing up a second real-time channel. | **Twilio/Daily/Agora** — hosted SFU/TURN infrastructure with per-minute billing; the right call at real scale, overkill here. Known gap from choosing raw WebRTC: **no TURN server is configured**, so calls between two peers both behind restrictive/symmetric NATs (common on corporate networks) can fail to connect — a direct, honest trade-off of this choice (see [§5](#5-known-limitations--own-them-before-theyre-asked)). |
| Auth | JWT in role-specific cookies (`token`/`emstoken`/`emtoken` for user/doctor/admin), verified per-request by role-specific middleware | Stateless — any backend instance can verify a JWT with just `JWT_SECRET`, no shared session store needed. That statelessness is *exactly* what makes the two-instance-behind-Nginx setup work without sticky sessions being a hard requirement for correctness (they're used for the Socket.IO handshake, not for auth). | **Server-side sessions** (`express-session` + a store) — would need a shared session store (Redis, again) reachable by both instances anyway, for no real benefit over stateless JWTs here. Known trade-off of JWTs: no true "log out everywhere" — a stolen token stays valid until it expires, since there's no revocation list. A Redis-backed denylist-on-logout would close that gap. |
| Password hashing | bcrypt / bcryptjs | Industry-standard, salted, deliberately slow (adaptive cost factor) — resists brute-force and rainbow-table attacks, unlike fast general-purpose hashes (SHA-256 etc.), which are wrong for passwords specifically. | Plaintext / reversible encryption — never; fast hashes (MD5/SHA-family alone) — crackable at scale with commodity GPUs. |
| File storage | Cloudinary | Managed CDN delivery + on-the-fly image transforms, generous free tier, and critically: the backend runs in **ephemeral Docker containers** — anything written to local disk is gone on the next redeploy/restart. Cloudinary removes that whole failure class. | **Local disk** — actually attempted in one route during development (`userrouter.js`'s old `diskStorage` config) and was a real bug: the handler expected `req.file.buffer` for a Cloudinary upload, but disk storage doesn't populate `.buffer`, so profile-picture uploads silently no-op'd. Fixed by switching to the same shared memory-storage Multer config (`middleware/multer.js`) every other upload route already used — good example of "why consistency across routes matters." **Raw S3** — viable, but Cloudinary's image-transform API and free tier were a better fit for a project this size. |
| AI | Google Gemini (`gemini-2.5-flash`) | One multimodal model covers three distinct features — text chat, image-based skin analysis, and (potentially) document analysis — through a single SDK, instead of stitching together separate vision/text APIs. "Flash" specifically for low latency, since the chatbot streams token-by-token over SSE. | **OpenAI GPT** — comparable capability, but would mean paying for/integrating a second vendor when Gemini's multimodal input already covers every use case here. **Local/open models** (Llama, etc.) — would need GPU infrastructure this project doesn't run. |
| Email | Nodemailer + Gmail SMTP | Zero-cost, zero-config for OTP delivery and credential emails at this stage. | **SendGrid/SES** — better deliverability and no Gmail sending-rate ceiling; the honest answer for "what breaks first at scale" — Gmail SMTP is the first thing that would need replacing under real load. |
| Rate limiting | `express-rate-limit` + `rate-limit-redis` | Must be centrally stored once there are 2+ backend instances — an in-memory limiter would let a client double their effective limit just by landing on both instances in turn. Applied specifically to the routes that call paid external APIs (chat, skin analysis, triage, hospital search) — the ones where abuse costs real money. | In-memory `express-rate-limit` alone — works for a single instance, silently breaks (limit effectively doubles) the moment you scale horizontally. |
| Geolocation | MongoDB `2dsphere` index (internal doctors) + OpenStreetMap Nominatim (geocoding) + Overpass API (external hospitals) | Zero API key, zero cost, no billing surface to manage, and sufficient accuracy for "find nearby care." Symptom text is run through the same Gemini triage used by the chatbot to infer a specialization, which then filters the geospatial query. | **Google Maps Platform** — better data completeness and generally higher rate limits, but requires an API key and a billing account for what is, today, a demo-scale feature. |
| Containerization | Docker + Docker Compose + Nginx | Reproducible builds, and it's the concrete mechanism behind the horizontal-scaling story: two identical `backend` containers behind an Nginx reverse proxy doing load balancing, sticky sessions, and passive health-check failover. | **PaaS (Render/Railway/Heroku)** — simpler to deploy, but abstracts away exactly the load-balancer/sticky-session/health-check mechanics this project is meant to demonstrate hands-on control over. |
| Frontend hosting | Vercel | Zero-config static hosting for a Vite build, free tier, instant global CDN, git-integrated deploys. | Self-hosted (S3+CloudFront, or serving static files from the same Nginx) — more infra to own for no benefit at this traffic level. |

---

## 3. Core Design Decisions, Explained

Full diagrams for all of these are in [`../README.md#architecture--diagrams`](../README.md#architecture--diagrams) and [`uml.md`](uml.md) — this section is the narrated version, for talking through without needing to look at a diagram.

**Two request paths, one Socket.IO layer.** REST handles anything transactional (auth, profile edits, bookings, uploads); Socket.IO handles anything real-time (chat messages, WebRTC signaling). They're architecturally separate but share the same JWT secret and the same MongoDB — a socket connection is authenticated once at handshake time (`socket.handshake.auth = { token, role }`), not per-event.

**Why three cookies instead of one unified session.** There's no concept of "one logged-in identity that happens to have a role" — a user, a doctor, and an admin are three unrelated collections with three independent JWT middlewares (`middleware/user.js`, `doctor.js`, `admin.js`), each checking a differently-named cookie against the same `JWT_SECRET`. This means the same person could theoretically be logged in as a patient and a doctor simultaneously in the same browser — a real consequence of the design, not a bug, and a reasonable thing to bring up proactively if asked about the auth model.

**Router → Service → Model — two layers, not three.** Every router file imports functions straight from a service module and wires them directly as Express handlers (`router.post("/userlogin", userlogin)`). **There is no controller layer in this codebase** — if you're asked to open "the appointment controller," say so directly rather than going looking for a file that doesn't exist. (Earlier drafts of this project's own docs incorrectly described a four-layer `Router → Controller → Service → Model` architecture with named controller files; that's been corrected — see `git log` on `README.md`/`docs/` if asked why the docs changed.)

**Preventing double-booking.** The self-serve slot-booking flow (`POST /book-slot`) relies on a MongoDB compound **unique index** on `{doctorid, date, time}` in the `appointmentnew` collection, not application-level locking. Two patients racing for the same slot both pass the `GET /available-slots` check, but only one `insert` succeeds — the second hits a `E11000 duplicate key` error, which the service layer turns into a `409` telling the client to refresh and re-pick. This is the single best "tell me about a concurrency bug you had to think about" answer in this codebase.

**Doctor onboarding is two collections, not one.** A doctor application lands in `permission` (`doctorpermissions` collection) with a Cloudinary-hosted certificate and `permission: "pending"`. Only after an admin approves it does a real `doctor` document get created, with a random password emailed to the applicant. This means `Doctor` and `DoctorPermission` are deliberately separate — a doctor **only exists** in the `doctor` collection post-approval, so "is this doctor real" and "is this application approved" can never disagree.

**Horizontal scaling is stateless by construction.** Two backend instances behind Nginx work because nothing that matters is held in either process's memory: auth is stateless JWTs, and the only real-time-feeling shared state (chat rooms, meeting participant lists) lives in Redis via the Socket.IO adapter, not in a Node process. `ip_hash` sticky sessions exist for one specific reason — Engine.IO's initial handshake is a plain HTTP long-poll before it upgrades to a WebSocket, and that sequence needs to land on one instance — not because auth or chat state require it.

**Why OTP-gate registration.** `POST /userregister` doesn't create a `user` document — it hashes the password, generates an OTP, and upserts into a `PendingUser` staging collection (10-minute TTL). Only `POST /userregisterverify` (correct OTP) actually creates the real `User`. This guarantees every account in the real collection has a verified, reachable email, and abandoned/unverified signups clean themselves up automatically via the TTL index rather than leaving junk rows.

---

## 4. Numbers & Facts Cheat Sheet

- **JWT expiry:** user `1h`, doctor `1d`, admin `1d`. (If asked why user is shorter — a defensible answer: patients are more likely to be on shared/public devices, so a shorter-lived token limits exposure; doctors/admins are trusted staff on personal devices. Be upfront this wasn't necessarily a deliberate original design note, just the current defensible read of it.)
- **OTP validity:** 10 minutes (`otps` and `pendingusers` collections both TTL-expire in 600s).
- **AI-cost route rate limits:** 20 requests/minute per IP, Redis-backed, on `/chat`, `/skin-analysis`, `/triage`, and the hospital-search route — these are the routes that call paid external APIs.
- **Backend instances:** 2 (`backend1`, `backend2`), Nginx `ip_hash` sticky sessions, `max_fails=3 fail_timeout=30s` passive health checks.
- **Node version floor:** 20.19+ — mongoose/mongodb-driver depend on the global Web Crypto API; Node 18 fails to connect to MongoDB with `crypto is not defined`.
- **Docker base image:** `node:22-alpine`.
- **Unique indexes:** `email` on `user`/`doctor` (was previously missing — every login was a full collection scan before it was added); compound `{doctorid, date, time}` on `appointmentnew` (the double-booking guard).
- **WebRTC:** STUN only (`stun.l.google.com:19302`), no TURN server configured.

---

## 5. Known Limitations — Own Them Before They're Asked

Bringing these up first (briefly, confidently) reads as engineering maturity — better than an interviewer finding one and watching you get defensive.

1. **No automated test suite.** Zero unit/integration/e2e tests today. The CI pipeline (`.github/workflows/ci.yml`) currently does lint + build + a per-file syntax check + a Docker build validation — real, but not test coverage. The concrete next step: Jest + Supertest for the service layer (mock Mongoose models, hit exported service functions directly — no controller layer to work around), React Testing Library for component behavior, Playwright/Cypress for the three flows that matter most end-to-end (booking a slot, sending a chat message, joining a video call).
2. **No TURN server.** WebRTC calls are STUN-only P2P; two peers both behind restrictive/symmetric NATs (common on corporate networks) can fail to connect. A TURN server (coturn, self-hosted, or a managed one) relays media as a fallback — the standard fix, not yet done.
3. **MongoDB relations are convention, not constraint.** `appointment.userid`/`doctorid` are plain strings, not enforced foreign keys — nothing at the database level stops an orphaned reference. Mitigated by consistent application-level lookups, but a real trade-off of choosing MongoDB's flexibility over relational integrity.
4. **JWTs can't be revoked early.** No denylist — a token is valid until it naturally expires, even after logout. A Redis-backed revocation set keyed by token/user would close this.
5. **Password reset emails a new plaintext password**, rather than a signed reset link. It's OTP-gated (so only the mailbox owner can trigger it), which is a reasonable middle ground, but a reset-token link is the more conventional pattern and avoids ever putting a credential in an email body.
6. **Admin is a hard singleton.** `adminregister` only succeeds while the `admin` collection is empty — there's no multi-admin model, and no way to add a second admin except direct database access. Fine for this project's scope, a real limitation for a multi-operator deployment.
7. **Gmail SMTP for transactional email** — fine at low volume, has sending-rate ceilings and worse deliverability than a dedicated ESP (SendGrid/SES) at real scale.

---

## 6. Hard Questions, Prepared Answers

**"Why MongoDB when appointments clearly have relationships — why not Postgres?"**
Because the parts of the domain that change shape often (doctor profiles with many optional fields, chat history, report follow-up threads) are naturally document-shaped, and the relational parts (user↔appointment↔doctor) are simple enough to manage correctly in application code with the right indexes — specifically the compound unique index that prevents double-booking. If this were going into a regulated production environment where referential integrity had to be guaranteed by the database itself rather than by application discipline, Postgres would be the more defensible choice, and I'd say so upfront rather than defend Mongo as strictly better.

**"How do you actually prevent two patients booking the same slot?"**
A MongoDB compound unique index on `{doctorid, date, time}`. Both clients can pass the "is this slot free" read at the same time; only one insert wins, the loser gets a duplicate-key error mapped to a 409, and the frontend refetches available slots. It's optimistic concurrency at the database layer, not a lock.

**"What happens if one of your two backend servers crashes?"**
Nginx's passive health check (`max_fails=3 fail_timeout=30s`) stops routing to it, and every request goes to the surviving instance. No state is lost because neither instance holds anything the other doesn't also have access to — auth is stateless JWTs, and real-time state (chat rooms, meeting rosters) lives in Redis via the Socket.IO adapter, not in-process.

**"Why Socket.IO instead of raw WebSockets?"**
Reconnection handling, long-poll fallback when a WebSocket can't be established, and a room abstraction that maps directly onto "one room per conversation" — all of which I'd otherwise have to hand-roll. The cost is a slightly heavier protocol than raw WebSocket frames, which is a fine trade for a chat/signaling workload that isn't latency-microsecond-sensitive.

**"You have two servers — how does chat still work no matter which one a user connects to?"**
`@socket.io/redis-adapter`. `io.to(room).emit()` publishes through Redis pub/sub instead of only broadcasting to sockets in the current process, so a message from a client on `backend1` reaches a client on `backend2` in the same room.

**"Walk me through what happens when a user logs in."**
`POST /userlogin` → service looks up the user by email, checks `userstatus` isn't `"block"`, compares the submitted password against the bcrypt hash. On success it signs a JWT (`{ token: email }` as payload — yes, the payload key is literally named `token`, holding the email; a naming leftover, not a bug) with a 1-hour expiry, and returns it to the client, which stores it in a cookie named `token`. Every subsequent authenticated request sends that cookie (or an `Authorization: Bearer` header), and `middleware/user.js` verifies it, loads the user by the email in the payload, and attaches it to `req.user`.

**"How do you handle file uploads?"**
Multer with in-memory storage (`middleware/multer.js`, shared across every upload route) buffers the file in memory, then the service layer streams that buffer straight to Cloudinary (`config/cloudinary.js#uploadBuffer`, via `streamifier`) — nothing ever touches the container's local disk, which matters because the containers are ephemeral and a local file wouldn't survive a redeploy anyway.

**"What's the biggest weakness of this system, honestly?"**
No automated tests. Everything above — the booking race condition, the auth middleware, the Redis-backed real-time layer — was verified by hand during development, not by a suite that keeps verifying it after every change. That's the highest-leverage thing I'd add next, and I'd start with Supertest against the service layer since there's no controller layer to mock around.

**"Why did you build your own auth instead of using something like Auth0/Clerk/Firebase Auth?"**
Three independent, simple role collections with straightforward password auth didn't need a third-party identity provider's complexity (SSO, MFA, social login) — none of which this app uses. The honest trade-off: I'm also on the hook for things a managed provider gives you for free, like token revocation and rate-limited login attempts beyond the general API rate limiter.

**"Why does the frontend have almost no global state management?"**
Because nothing in this app currently needs cross-page shared state beyond the auth cookie — every dashboard fetches its own data on mount. The moment a feature needs to share live state across unrelated pages (a notification count, an in-progress draft), that's the signal to add one, and I'd reach for Zustand over Redux for that — less boilerplate for what would likely be one or two small stores, not an app-wide state machine.

---

## 7. If Asked to Open the Code Live

Fast lookup so you're not hunting for files under pressure — full map in [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md).

| "Show me..." | Open this |
|---|---|
| The double-booking guard | [`Backend/model/Appointment/appointment.js`](../Backend/model/Appointment/appointment.js) — the compound unique index |
| Login / JWT signing | [`Backend/service/userservice.js`](../Backend/service/userservice.js) `exports.userlogin` |
| Auth middleware | [`Backend/middleware/user.js`](../Backend/middleware/user.js) / `doctor.js` / `admin.js` |
| Socket.IO + Redis adapter setup | [`Backend/socket/chatSocket.js`](../Backend/socket/chatSocket.js) |
| WebRTC signaling relay | [`Backend/socket/meetingSocket.js`](../Backend/socket/meetingSocket.js) |
| Rate limiting | [`Backend/middleware/rateLimit.js`](../Backend/middleware/rateLimit.js) |
| Nearby doctors/hospitals (geospatial + OSM) | [`Backend/service/hospitalservice.js`](../Backend/service/hospitalservice.js) |
| AI symptom triage | [`Backend/service/triageservice.js`](../Backend/service/triageservice.js) |
| Gemini chat streaming (SSE) | [`Backend/service/botservice.js`](../Backend/service/botservice.js) `exports.chatStream` |
| File upload → Cloudinary | [`Backend/middleware/multer.js`](../Backend/middleware/multer.js) + [`Backend/config/cloudinary.js`](../Backend/config/cloudinary.js) |
| Nginx load balancing config | [`nginx/nginx.conf`](../nginx/nginx.conf) |
| Docker Compose (2 backend instances) | [`docker-compose.yml`](../docker-compose.yml) |
| CI pipeline | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) |
| Frontend routing / role-based route groups | [`Frontend/src/App.jsx`](../Frontend/src/App.jsx) |
| Socket.IO client singleton | [`Frontend/src/socket.js`](../Frontend/src/socket.js) |
