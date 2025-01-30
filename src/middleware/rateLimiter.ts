import rateLimit from 'express-rate-limit';

export const createUrlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many URL creation requests from this IP, please try again after 15 minutes',
});

export const analyticsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many analytics requests from this IP, please try again after 15 minutes',
});