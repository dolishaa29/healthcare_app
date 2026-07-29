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
- Socket.IO (chat + meeting/signaling namespaces)
- JWT auth, bcrypt/bcryptjs
- Multer + Cloudinary (file uploads)
- Nodemailer (OTP emails)
- Google Generative AI SDK (Gemini) — chatbot, skin analysis, report analysis

## Project Structure

```
health/
├── Backend/
│   ├── index.js              # Express app entry point
│   ├── dbconnection.js       # MongoDB connection
│   ├── config/                # Cloudinary config
│   ├── router/                # Route definitions (admin, doctor, user, appointment, chat, rating, bot, report, skin analysis)
│   ├── controller/            # Request handlers
│   ├── service/                # Business logic (chat, appointments, ratings, AI services)
│   ├── model/                  # Mongoose schemas (User, Doctor, Admin, Appointment, Message, OTP, ...)
│   ├── middleware/             # JWT auth middleware per role + Multer upload config
│   └── socket/                 # Socket.IO handlers (chatSocket, meetingSocket/WebRTC signaling)
├── Frontend/
│   └── src/
│       ├── pages/               # Route-level pages (dashboards, chat, appointments, meeting, etc.)
│       ├── components/          # Shared components & layouts (AdminLayout, DoctorLayout, UserLayout, private routes)
│       └── socket.js            # Socket.IO client setup
└── docs/
    └── live.md                 # Deep-dive on the live-capture AI pipeline
```

## Getting Started

### Prerequisites
- Node.js 18+
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
```

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
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Run the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

> Note: `Backend/index.js` currently has the CORS origin hardcoded to the deployed frontend URL. Uncomment/adjust the `origin` value in `app.use(cors(...))` and in `socket/chatSocket.js` when running against a local frontend.

## Deployment

- **Backend** ships with a `Dockerfile` (Node 18 Alpine) exposing port `5000`.
- **Frontend** is deployed to Vercel.

## Documentation

See [docs/live.md](docs/live.md) for a detailed walkthrough of the live-capture pipeline (webcam capture → Socket.IO → server-side processing → real-time UI feedback).
