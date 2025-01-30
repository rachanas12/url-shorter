import express from 'express';
import passport from 'passport';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google Sign-In
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 *       503:
 *         description: Authentication service unavailable
 */
router.get('/google', (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    logger.warn('Google OAuth not configured');
    return res.status(503).json({
      error: 'Authentication service unavailable',
      message: 'Google OAuth is not configured. Please set up the required credentials.'
    });
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google Sign-In callback
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to home page after successful login
 */
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to home page after logout
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Get current user's authentication status
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User's authentication status
 */
router.get('/status', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
      }
    });
  } else {
    res.json({
      isAuthenticated: false,
      user: null
    });
  }
});

export default router;