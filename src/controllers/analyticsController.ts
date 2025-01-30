import { Request, Response } from 'express';
import { Analytics } from '../models/Analytics';
import { Url } from '../models/Url';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export const getUrlAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { alias } = req.params;
    const userId = req.user?._id;

    const url = await Url.findOne({ alias, userId });
    if (!url) {
      res.status(404).json({ error: 'URL not found' });
      return;
    }

    const analytics = await Analytics.find({ urlId: url._id });

    // Calculate statistics
    const totalClicks = url.clicks;
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    // Get clicks by date (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const clicksByDate = await Analytics.aggregate([
      {
        $match: {
          urlId: url._id,
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get OS statistics
    const osStats = await Analytics.aggregate([
      {
        $match: { urlId: url._id }
      },
      {
        $group: {
          _id: '$osType',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    // Get device type statistics
    const deviceStats = await Analytics.aggregate([
      {
        $match: { urlId: url._id }
      },
      {
        $group: {
          _id: '$deviceType',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats.map(stat => ({
        osName: stat._id,
        uniqueClicks: stat.uniqueClicks,
        uniqueUsers: stat.uniqueUsers.length
      })),
      deviceType: deviceStats.map(stat => ({
        deviceName: stat._id,
        uniqueClicks: stat.uniqueClicks,
        uniqueUsers: stat.uniqueUsers.length
      }))
    });
  } catch (error) {
    logger.error('Error getting URL analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTopicAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.params;
    const userId = req.user?._id;

    const urls = await Url.find({ userId, topic });
    const urlIds = urls.map(url => url._id);

    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    
    const analytics = await Analytics.find({ urlId: { $in: urlIds } });
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    // Get clicks by date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDate = await Analytics.aggregate([
      {
        $match: {
          urlId: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const urlStats = urls.map(url => ({
      shortUrl: url.shortUrl,
      totalClicks: url.clicks,
      uniqueUsers: new Set(analytics.filter(a => a.urlId.equals(url._id)).map(a => a.ipAddress)).size
    }));

    res.json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      urls: urlStats
    });
  } catch (error) {
    logger.error('Error getting topic analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOverallAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const urls = await Url.find({ userId });
    const urlIds = urls.map(url => url._id);

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    const analytics = await Analytics.find({ urlId: { $in: urlIds } });
    const uniqueUsers = new Set(analytics.map(a => a.ipAddress)).size;

    // Get clicks by date
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const clicksByDate = await Analytics.aggregate([
      {
        $match: {
          urlId: { $in: urlIds },
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get OS statistics
    const osStats = await Analytics.aggregate([
      {
        $match: { urlId: { $in: urlIds } }
      },
      {
        $group: {
          _id: '$osType',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    // Get device type statistics
    const deviceStats = await Analytics.aggregate([
      {
        $match: { urlId: { $in: urlIds } }
      },
      {
        $group: {
          _id: '$deviceType',
          uniqueClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$ipAddress' }
        }
      }
    ]);

    res.json({
      totalUrls,
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType: osStats.map(stat => ({
        osName: stat._id,
        uniqueClicks: stat.uniqueClicks,
        uniqueUsers: stat.uniqueUsers.length
      })),
      deviceType: deviceStats.map(stat => ({
        deviceName: stat._id,
        uniqueClicks: stat.uniqueClicks,
        uniqueUsers: stat.uniqueUsers.length
      }))
    });
  } catch (error) {
    logger.error('Error getting overall analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};