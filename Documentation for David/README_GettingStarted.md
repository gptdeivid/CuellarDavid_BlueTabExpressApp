# 🚀 Getting Started

Get the project running in under 5 minutes.

---

## Prerequisites

Make sure you have installed:

| Tool | Version | Check Command |
|------|---------|---------------|
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

**Don't have Node.js?** Download from [nodejs.org](https://nodejs.org/)

---

## Step 1: Install Dependencies

```bash
cd "c:\Users\cuell\OneDrive\Escritorio\IBM Express"
npm install
```

This downloads all required packages into the `node_modules/` folder.

**Expected output:**
```
added 196 packages in 36s
```

---

## Step 2: Set Up the Database

```bash
npx prisma migrate dev
```

This command:
1. Creates the SQLite database file (`prisma/dev.db`)
2. Creates the `User` table
3. Seeds the database with 3 sample users

**Expected output:**
```
SQLite database dev.db created at file:./dev.db
Applying migration `20260106052345_init`
The seed command has been executed.
```

---

## Step 3: Start the Server

```bash
npm run dev
```

**Expected output:**
```
🚀 Server is running on http://localhost:3000
📚 Swagger docs available at http://localhost:3000/api-docs
🔒 GraphQL endpoint at http://localhost:3000/graphql
```

---

## Step 4: Verify It Works

### Test REST API

Open your browser to: **http://localhost:3000/users/user1**

Expected response:
```json
{"id":"user1","name":"John Doe"}
```

### Test GraphQL API

Open: **http://localhost:3000/graphql**

This opens Apollo Studio. Run this query:
```graphql
{
  user(id: "user1") {
    id
    name
  }
}
```

### View API Documentation

Open: **http://localhost:3000/api-docs**

Interactive Swagger documentation appears.

---

## Available Users

The database is seeded with these users:

| ID | Name |
|----|------|
| user1 | John Doe |
| user2 | Jane Smith |
| user3 | Bob Wilson |

---

## Common Commands

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start development server |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npx prisma studio` | Open visual database browser |
| `npx prisma db seed` | Re-seed database |
| `Ctrl + C` | Stop the server |

---

## Next Steps

Now that it's running:
- Read [Architecture](./README_Architecture.md) to understand how it works
- Read [API Reference](./README_API.md) to learn how to use the endpoints
