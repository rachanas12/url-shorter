# URL Shortener API

A scalable URL shortener API with advanced analytics, Google Sign-In authentication, and rate limiting.

## Features

- URL shortening with custom aliases
- Advanced analytics tracking
- Google Sign-In authentication
- Rate limiting
- Redis caching
- Topic-based URL grouping
- Detailed analytics by URL, topic, and overall usage
- Docker support for easy deployment

## Tech Stack

- Node.js with TypeScript
- Express.js
- MongoDB with Mongoose
- Redis for caching
- Passport.js for authentication
- Swagger for API documentation
- Winston for logging
- Docker for containerization

## Prerequisites

- Node.js 18 or higher
- MongoDB
- Redis
- Docker and Docker Compose (for containerized deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url-shortener-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration values.

## Development

1. Start the development server:
    <boltAction type="file" filePath="README.md">   ```bash
   npm run dev
   ```

2. Access the API documentation:
   ```bash
   http://localhost:3000/api-docs
   ```

## Docker Deployment

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. The API will be available at:
   ```bash
   http://localhost:3000
   ```

## API Endpoints

### Authentication
- `GET /auth/google` - Initiate Google Sign-In
- `GET /auth/google/callback` - Google Sign-In callback
- `GET /auth/logout` - Logout

### URL Operations
- `POST /api/shorten` - Create short URL
- `GET /api/{alias}` - Redirect to original URL

### Analytics
- `GET /api/analytics/{alias}` - Get URL-specific analytics
- `GET /api/analytics/topic/{topic}` - Get topic-based analytics
- `GET /api/analytics/overall` - Get overall analytics

## Rate Limiting

- URL creation: 100 requests per 15 minutes
- Analytics requests: 200 requests per 15 minutes

## Caching

Redis is used to cache:
- URL mappings (24-hour TTL)
- Analytics data (configurable TTL)

## Security

- Google Sign-In authentication
- Rate limiting
- Helmet.js for security headers
- CORS configuration
- Session management

## Testing

Run the test suite:
```bash
npm test
```

## Logging

Logs are stored in:
- `error.log` - Error-level logs
- `combined.log` - All logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License