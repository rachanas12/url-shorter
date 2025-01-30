import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../index';
import { Url } from '../models/Url';
import { redisClient } from '../config/redis';

describe('URL Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test-db');
    await redisClient.connect();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await Url.deleteMany({});
    await redisClient.flushAll();
  });

  describe('POST /api/shorten', () => {
    it('should create a short URL', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({
          longUrl: 'https://example.com',
          customAlias: 'test123',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('shortUrl');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should return 400 if longUrl is missing', async () => {
      const response = await request(app)
        .post('/api/shorten')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/:alias', () => {
    it('should redirect to the original URL', async () => {
      const url = await Url.create({
        longUrl: 'https://example.com',
        shortUrl: 'http://localhost:3000/test123',
        alias: 'test123',
      });

      const response = await request(app).get('/api/test123');
      expect(response.status).toBe(302);
      expect(response.header.location).toBe('https://example.com');
    });

    it('should return 404 for non-existent alias', async () => {
      const response = await request(app).get('/api/nonexistent');
      expect(response.status).toBe(404);
    });
  });
});