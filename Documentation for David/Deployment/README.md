# 🚀 Deployment Guide

How to deploy this microservice to production while respecting the project requirements.

---

## 📋 Project Requirements

This microservice must fulfill these requirements in production:

| Requirement | Description |
|-------------|-------------|
| **Singleton Pattern** | Express app exposed as readonly class attribute |
| **Domain Restriction** | Only accept traffic from `example.com` |
| **OpenAPI Swagger** | Document REST API at `/api-docs` |
| **GraphQL** | Apollo Server at `/graphql` |
| **PrismaJS + SQLite** | User table with ID and Name |
| **REST API** | `GET /users/{id}` |
| **GraphQL Query** | `user(id: String!)` with variables support |
| **Coexistence** | Both APIs on same microservice |

---

## ⚠️ Important: Domain Configuration

The app only accepts traffic from **example.com**. Before deploying:

### Update Allowed Domains

Edit `src/middleware/domainRestriction.ts`:

```typescript
const allowedHosts = [
  'example.com',           // Required by project
  'www.example.com',
  'api.example.com',       // If using subdomain
  'your-app.railway.app',  // Add your hosting domain
  'localhost:3000',        // Keep for local testing
];
```

---

## Deployment Options

| Platform | Difficulty | Free Tier |
|----------|------------|-----------|
| **Railway** | Easy | Yes |
| **Render** | Easy | Yes |
| **Heroku** | Easy | Paid |
| **Docker** | Medium | N/A |
| **VPS** | Hard | Varies |

---

## Railway (Recommended)

### Steps

```bash
# 1. Install CLI
npm install -g @railway/cli
railway login

# 2. Initialize
railway init

# 3. Add PostgreSQL (for production)
railway add --plugin postgresql

# 4. Deploy
railway up

# 5. Run migrations
railway run npx prisma migrate deploy
```

### Configuration

Create `railway.json`:
```json
{
  "deploy": {
    "startCommand": "npm run prisma:deploy && npm start"
  }
}
```

---

## Render

1. Connect GitHub repository
2. Create Web Service:
   - **Build**: `npm install && npm run build`
   - **Start**: `npm run prisma:deploy && npm start`
3. Add PostgreSQL database
4. Set `DATABASE_URL` environment variable

---

## Docker

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npx prisma generate
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app
      - NODE_ENV=production
    depends_on:
      - db
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data
volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

---

## Production Database

Switch from SQLite to PostgreSQL for production.

### Update schema.prisma

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Set Environment Variable

```
DATABASE_URL="postgresql://user:password@host:5432/database"
```

---

## Production Checklist

### ✅ Before Deploying

- [ ] Update `domainRestriction.ts` with production domain
- [ ] Switch to PostgreSQL
- [ ] Set `NODE_ENV=production`
- [ ] Build project: `npm run build`
- [ ] Test locally: `npm start`

### ✅ After Deploying

- [ ] Verify `/api-docs` loads (Swagger)
- [ ] Verify `/graphql` works (GraphQL)
- [ ] Verify `GET /users/:id` works (REST)
- [ ] Verify domain restriction functions
- [ ] Set up HTTPS/SSL

---

## Environment Variables

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | `3000` |
| `NODE_ENV` | `production` |

---

## Verify Deployment

### Test REST API
```bash
curl https://your-domain.com/users/user1
```

### Test GraphQL
```bash
curl -X POST https://your-domain.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ user(id: \"user1\") { id name } }"}'
```

### Test Swagger
Open: `https://your-domain.com/api-docs`

---

*Remember: Update domain restriction to include your hosting domain!*
