<p align="center">
  <img src="Frontend/src/assets/logo-hat.png" alt="Ment2Be Logo" width="80"/>
</p>

<h1 align="center">Ment2Be</h1>

<p align="center">
  <strong>Connect. Learn. Grow.</strong><br/>
  A full-stack mentorship platform connecting students with industry experts for personalized guidance and career growth.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express-5.1-000000?logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?logo=socket.io&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="License"/>
</p>

<p align="center">
  <img src="Frontend/src/assets/MentorDahboard.png" alt="Ment2Be Dashboard Preview" width="80%"/>
</p>

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

## Features

### For Students
- **Explore Mentors** — Browse mentors by skills, expertise, and ratings
- **Book Sessions** — Schedule 1-on-1 video sessions
- **Real-time Chat** — Instant messaging with Socket.IO
- **Task Management** — Track assignments and learning goals
- **Learning Journal** — Document growth and insights
- **Rate & Review** — Share feedback with video testimonials
- **Karma Points** — Earn rewards for engagement

### For Mentors
- **Dashboard Analytics** — Track mentees, sessions, and performance
- **Availability Management** — Set available time slots
- **Task Assignment** — Create and track tasks for mentees
- **Earnings Tracking** — Monitor payments and revenue
- **Profile Customization** — Showcase skills and hourly rates

### Platform Features
- **HD Video Conferencing** — Powered by ZegoCloud with screen sharing
- **Real-time Messaging** — Typing indicators, read receipts, online status
- **Secure Authentication** — JWT + Google OAuth with role-based access
- **Payment Integration** — Razorpay for session bookings
- **Media Uploads** — Cloudinary for profile pictures and videos

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, TailwindCSS, React Router 7, Framer Motion |
| **Backend** | Node.js 18+, Express 5, MongoDB Atlas, Mongoose 8 |
| **Real-time** | Socket.IO 4.8, Stream Chat |
| **Video** | ZegoCloud UIKit |
| **Auth** | JWT, Google OAuth, bcrypt |
| **Storage** | Cloudinary |
| **Payments** | Razorpay |
| **Email** | Nodemailer |

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- ZegoCloud account (for video)

### Installation

```bash
# Clone the repository
git clone https://github.com/arshchouhan/Ment2Be.git
cd Ment2Be

# Install backend dependencies
cd Backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials (see Environment Variables section)

# Install frontend dependencies
cd ../Frontend
npm install
```

### Running Locally

```bash
# Terminal 1: Start backend (http://localhost:4000)
cd Backend
npm run dev

# Terminal 2: Start frontend (http://localhost:5173)
cd Frontend
npm run dev
```

## Project Structure

```
Ment2Be/
├── Backend/
│   ├── config/           # Database & service configs
│   ├── controllers/      # Request handlers (23 controllers)
│   ├── middleware/       # Auth & validation
│   ├── models/           # MongoDB schemas (17 models)
│   ├── routes/           # API routes (26 route files)
│   ├── services/         # Business logic
│   ├── socket/           # Socket.IO handlers
│   └── index.js          # Server entry point
│
├── Frontend/
│   └── src/
│       ├── assets/       # Images & static files
│       ├── components/   # Reusable UI (75+ components)
│       ├── config/       # API & backend configuration
│       ├── context/      # React context providers
│       ├── pages/        # Page components (38 pages)
│       ├── services/     # API service functions
│       └── App.jsx       # Root component with routes
│
└── README.md
```

## Environment Variables

### Backend (`Backend/.env`)

```env
# Required
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
GOOGLE_CLIENT_ID=your_google_client_id
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
GEMINI_API_KEY=your_gemini_key
```

See `Backend/.env.example` for the complete list.

### Frontend (`Frontend/.env.local`)

```env
VITE_API_URL=http://localhost:4000
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_secret
```

## Usage

### Student Flow
1. Register/Login → Complete profile
2. Browse mentors on Explore page
3. Connect with a mentor
4. Book a session and make payment
5. Join video session at scheduled time
6. Complete tasks assigned by mentor
7. Rate and review the session

### Mentor Flow
1. Register as mentor → Set up profile
2. Configure availability and hourly rate
3. Accept connection requests
4. Conduct video sessions
5. Assign tasks to mentees
6. Track earnings and reviews

## API Overview

| Category | Endpoints |
|----------|-----------|
| **Auth** | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google` |
| **Users** | `GET /api/user/me`, `PUT /api/user/update` |
| **Mentors** | `GET /api/mentors`, `GET /api/mentors/:id`, `PUT /api/mentors/profile` |
| **Bookings** | `POST /api/bookings`, `GET /api/bookings`, `POST /api/bookings/:id/join` |
| **Messages** | `GET /api/messages/conversations`, `POST /api/messages/send` |
| **Tasks** | `POST /api/tasks`, `GET /api/tasks`, `PUT /api/tasks/:id` |
| **Reviews** | `POST /api/reviews`, `GET /api/reviews` |
| **Forum** | `GET /api/forum/questions`, `POST /api/forum/questions` |

## Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/studentdashbaordimage.png" alt="Student Dashboard"/>
      <br/><em>Student Dashboard</em>
    </td>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/connect1.png" alt="Connect with Mentors"/>
      <br/><em>Connect with Mentors</em>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/taskbymentee.png" alt="Task Management"/>
      <br/><em>Task Management</em>
    </td>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/trust.png" alt="Platform Features"/>
      <br/><em>Platform Features</em>
    </td>
  </tr>
</table>

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## Support

- **Issues**: [GitHub Issues](https://github.com/arshchouhan/Ment2Be/issues)
- **Author**: [Arsh Chauhan](https://github.com/arshchouhan)

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  <img src="Frontend/src/assets/logo-hat.png" alt="Ment2Be" width="40"/>
  <br/>
  <sub>Built with ❤️ for the mentorship community</sub>
</p>
