import express from 'express';
import {
  getUrlAnalytics,
  getTopicAnalytics,
  getOverallAnalytics,
} from '../controllers/analyticsController';
import { isAuthenticated } from '../middleware/auth';
import { analyticsLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/{alias}:
 *   get:
 *     summary: Get analytics for a specific URL
 *     tags: [Analytics]
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL analytics retrieved successfully
 */
router.get('/:alias', isAuthenticated, analyticsLimiter, getUrlAnalytics);

/**
 * @swagger
 * /api/analytics/topic/{topic}:
 *   get:
 *     summary: Get analytics for a specific topic
 *     tags: [Analytics]
 *     security:
 *       - googleAuth: []
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Topic analytics retrieved successfully
 */
router.get('/topic/:topic', isAuthenticated, analyticsLimiter, getTopicAnalytics);

/**
 * @swagger
 * /api/analytics/overall:
 *   get:
 *     summary: Get overall analytics
 *     tags: [Analytics]
 *     security:
 *       - googleAuth: []
 *     responses:
 *       200:
 *         description: Overall analytics retrieved successfully
 */
router.get('/overall', isAuthenticated, analyticsLimiter, getOverallAnalytics);

export default router;