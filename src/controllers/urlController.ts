import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { Url } from '../models/Url';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export const createUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { longUrl, customAlias, topic } = req.body;
    const userId = req.user?._id;

    if (!longUrl) {
      res.status(400).json({ error: 'Long URL is required' });
      return;
    }

    const alias = customAlias || nanoid(8);
    const shortUrl = `${process.env.BASE_URL}/api/${alias}`;

    const url = await Url.create({
      userId,
      longUrl,
      shortUrl,
      alias,
      topic,
    });

    await redisClient.set(`url:${alias}`, longUrl, { EX: 86400 }); // Cache for 24 hours

    res.status(201).json({
      shortUrl,
      createdAt: url.createdAt,
    });
  } catch (error) {
    logger.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const redirectUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alias } = req.params;

    // Try to get URL from cache
    const cachedUrl = await redisClient.get(`url:${alias}`);
    
    if (cachedUrl) {
      res.redirect(cachedUrl);
      return;
    }

    const url = await Url.findOne({ alias });
    
    if (!url) {
      res.status(404).json({ error: 'URL not found' });
      return;
    }

    // Update click count
    url.clicks += 1;
    await url.save();

    // Cache the URL
    await redisClient.set(`url:${alias}`, url.longUrl, { EX: 86400 });

    res.redirect(url.longUrl);
  } catch (error) {
    logger.error('Error redirecting URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};