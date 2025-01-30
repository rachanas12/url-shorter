import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import { Url } from '../models/Url';
import { Analytics } from '../models/Analytics';

describe('Analytics Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Url.deleteMany({});
    await Analytics.deleteMany({});
  });

  describe('GET /api/analytics/:alias', () => {
    it('should return URL analytics', async () => {
      const url = await Url.create({
        longUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/test123',
        alias: 'test123',
        clicks: 10,
      });

      await Analytics.create({
        urlId: url._id,
        userAgent: 'test-agent',
        ipAddress: '127.0.0.1',
        osType: 'Windows',
        deviceType: 'Desktop',
        browser: 'Chrome',
      });

      const response = await request(app).get('/api/analytics/test123');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalClicks', 10);
      expect(response.body).toHaveProperty('uniqueUsers');
      expect(response.body).toHaveProperty('clicksByDate');
      expect(response.body).toHaveProperty('osType');
      expect(response.body).toHaveProperty('deviceType');
    });

    it('should return 404 for non-existent alias', async () => {
      const response = await request(app).get('/api/analytics/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});