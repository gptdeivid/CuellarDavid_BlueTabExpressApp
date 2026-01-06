# 🔌 API Reference

Complete guide to both REST and GraphQL APIs.

---

## Two Ways to Access Data

This project offers the SAME data through two different API styles:

| Feature | REST API | GraphQL API |
|---------|----------|-------------|
| **Endpoint** | `/users/:id` | `/graphql` |
| **HTTP Method** | GET | POST |
| **Response** | Fixed shape | You choose fields |
| **Best for** | Simple CRUD | Complex/flexible queries |

---

## REST API

### `GET /users/:id`

Retrieves a single user by their ID.

**Request:**
```http
GET http://localhost:3000/users/user1
Host: localhost:3000
```

**Success Response (200 OK):**
```json
{
  "id": "user1",
  "name": "John Doe"
}
```

**Error Responses:**

| Status | Condition | Response |
|--------|-----------|----------|
| 404 | User not found | `{"error":"Not Found","message":"User with ID 'xyz' not found"}` |
| 403 | Domain blocked | `{"error":"Forbidden","message":"Access denied..."}` |
| 400 | Invalid ID | `{"error":"ApiError","message":"Invalid user ID provided"}` |

---

### Testing REST API

**PowerShell:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/user1"
```

**cURL (Git Bash / WSL):**
```bash
curl http://localhost:3000/users/user1
```

**Browser:**
Simply open http://localhost:3000/users/user1

---

## GraphQL API

### Endpoint: `POST /graphql`

All GraphQL operations go through this single endpoint.

### Schema

```graphql
type User {
  id: String!     # ! means required (non-null)
  name: String!
}

type Query {
  user(id: String!): User   # Returns User or null
}
```

---

### Basic Query

**Request:**
```graphql
query {
  user(id: "user1") {
    id
    name
  }
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": "user1",
      "name": "John Doe"
    }
  }
}
```

---

### Request Only Specific Fields

You can request just the fields you need:

```graphql
query {
  user(id: "user1") {
    name
  }
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "name": "John Doe"
    }
  }
}
```

---

### Using Variables

Instead of hardcoding values, use variables:

**Query:**
```graphql
query GetUser($userId: String!) {
  user(id: $userId) {
    id
    name
  }
}
```

**Variables:**
```json
{
  "userId": "user1"
}
```

---

### GraphQL Error Handling

GraphQL always returns HTTP 200, but includes an `errors` array if something went wrong:

**User not found:**
```json
{
  "data": {
    "user": null
  }
}
```

**Invalid query:**
```json
{
  "errors": [
    {
      "message": "Cannot query field \"email\" on type \"User\"",
      "locations": [{ "line": 3, "column": 5 }]
    }
  ]
}
```

---

### Testing GraphQL

**Apollo Studio (Browser):**
1. Open http://localhost:3000/graphql
2. Type your query in the editor
3. Click "Run"

**PowerShell:**
```powershell
$body = '{"query": "{ user(id: \"user1\") { id name } }"}'
Invoke-RestMethod -Uri "http://localhost:3000/graphql" -Method POST -ContentType "application/json" -Body $body
```

**cURL:**
```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ user(id: \"user1\") { id name } }"}'
```

---

## Domain Restriction

Both APIs check the request origin:

| Domain | Status |
|--------|--------|
| `localhost:3000` | ✅ Allowed |
| `example.com` | ✅ Allowed |
| `www.example.com` | ✅ Allowed |
| Any other domain | ❌ 403 Forbidden |

**To test domain blocking:**
```powershell
# This will fail with 403
Invoke-RestMethod -Uri "http://localhost:3000/users/user1" -Headers @{Host="evil.com"}
```

---

## Swagger Documentation

Interactive REST API documentation at: **http://localhost:3000/api-docs**

Features:
- See all endpoints
- View request/response schemas
- Try requests directly from the browser
- Export OpenAPI specification

---

## Health Check

Simple endpoint to verify the server is running:

**Request:**
```http
GET http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-05T23:00:00.000Z"
}
```

---

## When to Use Which API?

| Scenario | Recommended |
|----------|-------------|
| Simple data fetching | REST |
| Mobile app (save bandwidth) | GraphQL |
| Third-party integration | REST |
| Complex nested data | GraphQL |
| Caching important | REST |
| Rapidly evolving frontend | GraphQL |

---

## Available Test Data

The database is seeded with:

| ID | Name |
|----|------|
| user1 | John Doe |
| user2 | Jane Smith |
| user3 | Bob Wilson |

---

## Next Steps

- [Middleware Deep Dive](./README_Middleware.md) - How requests are processed
- [Troubleshooting](./README_Troubleshooting.md) - Common issues and solutions
