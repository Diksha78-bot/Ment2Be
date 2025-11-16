import express from 'express';
import connectDB from './config/db.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import skillsRouter from './routes/skills.routes.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const corsOptions = {
  origin: ['http://localhost:4000', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the MentorMatch API' });
});

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/skills', skillsRouter);

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Connect to database and start server
connectDB().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n✅ Server is running on port ${PORT}`);
        console.log(`🌐 http://localhost:${PORT}\n`);
    });
}).catch(error => {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
});