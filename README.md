<p align="center">
  <img src="Frontend/src/assets/logo-hat.png" alt="Ment2Be Logo" width="120"/>
</p>

<h1 align="center">🎓 Ment2Be</h1>

<p align="center">
  <strong>Connect. Learn. Grow.</strong><br/>
  A modern mentorship platform connecting students with industry experts for personalized guidance and career growth.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Express-5.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Socket.IO-Real--time-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/ZegoCloud-Video-FF6B35?style=for-the-badge" alt="ZegoCloud"/>
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary"/>
  <img src="https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge" alt="Razorpay"/>
</p>

---

## 📸 Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/MentorDahboard.png" alt="Mentor Dashboard" width="100%"/>
      <br/><strong>Mentor Dashboard</strong>
    </td>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/studentdashbaordimage.png" alt="Student Dashboard" width="100%"/>
      <br/><strong>Student Dashboard</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/connect1.png" alt="Connect with Mentors" width="100%"/>
      <br/><strong>Connect with Mentors</strong>
    </td>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/connect 2.png" alt="Mentorship Journey" width="100%"/>
      <br/><strong>Mentorship Journey</strong>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/taskbymentee.png" alt="Task Management" width="100%"/>
      <br/><strong>Task Management</strong>
    </td>
    <td align="center" width="50%">
      <img src="Frontend/src/assets/trust.png" alt="Trusted Platform" width="100%"/>
      <br/><strong>Trusted Platform</strong>
    </td>
  </tr>
</table>

---

## ✨ Features

### 👨‍🎓 For Students
- **🔍 Explore Mentors** - Browse and filter mentors by skills, expertise, and ratings
- **📅 Book Sessions** - Schedule 1-on-1 video sessions with mentors
- **💬 Real-time Chat** - Instant messaging with connected mentors
- **📝 Task Management** - Track assignments and learning goals
- **📓 Learning Journal** - Document your growth and insights
- **⭐ Rate & Review** - Share feedback on mentorship sessions
- **🎥 Video Testimonials** - Upload video reviews for mentors
- **🏆 Karma Points** - Earn rewards for engagement and achievements

### 👨‍🏫 For Mentors
- **📊 Dashboard Analytics** - Track mentees, sessions, and performance
- **📆 Availability Management** - Set your available time slots
- **👥 Mentee Management** - View and manage connected students
- **✅ Task Assignment** - Create and track tasks for mentees
- **💰 Earnings Tracking** - Monitor session payments and revenue
- **🌟 Profile Customization** - Showcase skills, experience, and rates
- **📈 Reviews & Ratings** - Build reputation through student feedback

### 🎥 Video Conferencing
- **HD Video Calls** - Powered by ZegoCloud for seamless video sessions
- **Screen Sharing** - Share your screen during mentorship sessions
- **In-call Chat** - Text chat during video sessions
- **Session Recording** - Record sessions for future reference

### 💬 Real-time Communication
- **Instant Messaging** - Socket.IO powered real-time chat
- **Typing Indicators** - See when others are typing
- **Read Receipts** - Know when messages are read
- **Online Status** - See who's currently online

### 🔐 Security & Authentication
- **JWT Authentication** - Secure token-based auth
- **Google OAuth** - Sign in with Google
- **Password Recovery** - Email-based password reset
- **Role-based Access** - Separate student and mentor permissions

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| Vite 7 | Build Tool |
| TailwindCSS 3.4 | Styling |
| React Router 7 | Navigation |
| Socket.IO Client | Real-time Communication |
| ZegoCloud UIKit | Video Conferencing |
| Framer Motion | Animations |
| Lucide React | Icons |
| Axios | HTTP Client |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js 18+ | Runtime |
| Express 5 | Web Framework |
| MongoDB Atlas | Database |
| Mongoose 8 | ODM |
| Socket.IO | WebSocket Server |
| JWT | Authentication |
| Cloudinary | Media Storage |
| Nodemailer | Email Service |
| Razorpay | Payment Gateway |
| Twilio | SMS/Video Services |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB Atlas account
- Cloudinary account
- ZegoCloud account (for video)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ment2be.git
cd ment2be
```

2. **Install Backend Dependencies**
```bash
cd Backend
npm install
```

3. **Configure Backend Environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
```env
# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_email_password

# Razorpay (optional)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

4. **Install Frontend Dependencies**
```bash
cd ../Frontend
npm install
```

5. **Configure Frontend Environment**
```bash
# Create .env.local file
VITE_API_URL=http://localhost:4000
VITE_ZEGO_APP_ID=your_zego_app_id
VITE_ZEGO_SERVER_SECRET=your_zego_server_secret
```

### Running the Application

**Start Backend Server**
```bash
cd Backend
npm run dev
# Server runs on http://localhost:4000
```

**Start Frontend Development Server**
```bash
cd Frontend
npm run dev
# App runs on http://localhost:5173
```

---

## 📁 Project Structure

```
Ment2Be/
├── Backend/
│   ├── config/          # Database & service configurations
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO handlers
│   ├── utils/           # Helper functions
│   └── index.js         # Server entry point
│
├── Frontend/
│   ├── src/
│   │   ├── assets/      # Images & static files
│   │   ├── components/  # Reusable UI components
│   │   ├── config/      # App configuration
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   └── utils/       # Utility functions
│   └── index.html       # HTML entry point
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/google` | Google OAuth login |
| POST | `/api/auth/forgot-password` | Request password reset |
| POST | `/api/auth/reset-password` | Reset password |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/me` | Get current user profile |
| PUT | `/api/user/update` | Update user profile |
| POST | `/api/user/upload-photo` | Upload profile picture |

### Mentors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/mentors` | Get all mentors |
| GET | `/api/mentors/:id` | Get mentor by ID |
| GET | `/api/mentors/top-experts` | Get top-rated mentors |
| PUT | `/api/mentors/profile` | Update mentor profile |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Get user bookings |
| POST | `/api/bookings/:id/join` | Join session |
| PUT | `/api/bookings/:id/status` | Update booking status |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | Get conversations |
| GET | `/api/messages/conversations/:id/messages` | Get messages |
| POST | `/api/messages/send` | Send message |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | Get tasks |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews` | Get reviews |

---

## 🎨 UI Components

<table>
  <tr>
    <td align="center">
      <img src="Frontend/src/assets/mentor.png" alt="Mentor Card" width="150"/>
      <br/><strong>Mentor Cards</strong>
    </td>
    <td align="center">
      <img src="Frontend/src/assets/student.png" alt="Student Profile" width="150"/>
      <br/><strong>Student Profiles</strong>
    </td>
    <td align="center">
      <img src="Frontend/src/assets/connect4.png" alt="Connection" width="150"/>
      <br/><strong>Connections</strong>
    </td>
    <td align="center">
      <img src="Frontend/src/assets/connect5.png" alt="Features" width="150"/>
      <br/><strong>Features</strong>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Arsh Chauhan**

- GitHub: [@arshchouhan](https://github.com/arshchouhan)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - CSS Framework
- [ZegoCloud](https://www.zegocloud.com/) - Video SDK
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time Engine
- [Cloudinary](https://cloudinary.com/) - Media Management

---

<p align="center">
  <img src="Frontend/src/assets/logo-hat.png" alt="Ment2Be" width="50"/>
  <br/>
  <strong>Made with ❤️ for the mentorship community</strong>
</p>
