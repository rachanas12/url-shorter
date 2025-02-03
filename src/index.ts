import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { swaggerUi, swaggerSpec } from './utils/swagger';
import { logger } from './utils/logger';

// Load environment variables before importing passport config
dotenv.config();

import './config/passport';
import authRoutes from './routes/auth';
import urlRoutes from './routes/url';
import analyticsRoutes from './routes/analytics';

const app = express();
const PORT = process.env.PORT || 3000;

// Validate required environment variables
if (!process.env.SESSION_SECRET) {
  logger.error('Missing SESSION_SECRET environment variable');
  throw new Error('SESSION_SECRET must be set in environment variables');
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/api', urlRoutes);
app.use('/api/analytics', analyticsRoutes);



// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const start = async () => {
  try {
    await connectDB();
    await connectRedis();
    
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

export { app };