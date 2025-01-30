import express from 'express';
import { createUrl, redirectUrl } from '../controllers/urlController';
import { isAuthenticated } from '../middleware/auth';
import { createUrlLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * @swagger
 * /api/shorten:
 *   post:
 *     summary: Create a short URL
 *     tags: [URLs]
 *     security:
 *       - googleAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *               customAlias:
 *                 type: string
 *               topic:
 *                 type: string
 *                 enum: [acquisition, activation, retention]
 *     responses:
 *       201:
 *         description: Short URL created successfully
 */
router.post('/shorten', isAuthenticated, createUrlLimiter, createUrl);

/**
 * @swagger
 * /api/shorten/{alias}:
 *   get:
 *     summary: Redirect to original URL
 *     tags: [URLs]
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 */
router.get('/:alias', redirectUrl);

export default router;