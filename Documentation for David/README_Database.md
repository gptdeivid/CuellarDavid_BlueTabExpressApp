# 🗄️ Database & Prisma

Everything about how data is stored and accessed.

---

## Overview

| Component | Role |
|-----------|------|
| **SQLite** | Database engine (stores data in a file) |
| **Prisma** | ORM (Object-Relational Mapper) |
| **schema.prisma** | Defines your data models |
| **Prisma Client** | Auto-generated query builder |

---

## The Schema File

Located at `prisma/schema.prisma`:

```prisma
// 1. DATABASE CONNECTION
datasource db {
  provider = "sqlite"         // Database type
  url      = "file:./dev.db"  // File location
}

// 2. CLIENT GENERATOR
generator client {
  provider = "prisma-client-js"
}

// 3. DATA MODELS
model User {
  id   String @id @default(cuid())
  name String
}
```

### Breaking It Down

**Datasource**: Where data lives
```prisma
datasource db {
  provider = "sqlite"         // Could be "postgresql", "mysql"
  url      = "file:./dev.db"  // Connection string
}
```

**Generator**: Creates the Prisma Client
```prisma
generator client {
  provider = "prisma-client-js"  // Generates TypeScript/JS client
}
```

**Model**: Defines a table
```prisma
model User {
  id   String @id @default(cuid())  // Primary key
  name String                        // Required field
}
```

---

## Field Types

| Prisma Type | Database Type | Description |
|-------------|---------------|-------------|
| `String` | TEXT | Text data |
| `Int` | INTEGER | Whole numbers |
| `Float` | REAL | Decimal numbers |
| `Boolean` | INTEGER (0/1) | True/false |
| `DateTime` | TEXT (ISO) | Dates and times |
| `Json` | TEXT | JSON objects |

---

## Field Attributes

| Attribute | Meaning | Example |
|-----------|---------|---------|
| `@id` | Primary key | `id String @id` |
| `@default()` | Default value | `@default(cuid())` |
| `@unique` | Must be unique | `email String @unique` |
| `@updatedAt` | Auto-update timestamp | `updatedAt DateTime @updatedAt` |
| `?` | Optional (nullable) | `bio String?` |

### Common Defaults

```prisma
@default(cuid())       // Unique collision-resistant ID
@default(uuid())       // UUID format
@default(autoincrement())  // 1, 2, 3...
@default(now())        // Current timestamp
@default(true)         // Boolean default
```

---

## What is CUID?

A **Collision-resistant Unique Identifier**:

```
clxyz123abc456def789...
```

| vs Auto-increment | CUID |
|-------------------|------|
| Sequential (1, 2, 3) | Random-looking |
| Easy to guess | Hard to guess |
| Database-specific | Can generate anywhere |
| Reveals count | Reveals nothing |

---

## Database Commands

### Generate Prisma Client

After changing the schema, regenerate the client:

```bash
npx prisma generate
```

This creates/updates TypeScript types matching your schema.

### Create Migration

When you change the schema:

```bash
npx prisma migrate dev --name describe_the_change
```

This:
1. Creates a migration file
2. Applies it to the database
3. Regenerates the client

### Reset Database

Start fresh:

```bash
npx prisma migrate reset
```

This deletes all data and reapplies migrations.

### Visual Database Browser

```bash
npx prisma studio
```

Opens a web UI to view, edit, add, and delete records.

---

## Querying Data

### Setup

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
```

### Find One

```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user1' }
});
// Returns: { id: 'user1', name: 'John Doe' } or null
```

### Find Many

```typescript
// All users
const allUsers = await prisma.user.findMany();

// With filter
const johns = await prisma.user.findMany({
  where: { name: { contains: 'John' } }
});

// With pagination
const page = await prisma.user.findMany({
  skip: 10,
  take: 5
});
```

### Create

```typescript
const newUser = await prisma.user.create({
  data: {
    name: 'Alice'
    // id is auto-generated
  }
});
```

### Update

```typescript
const updated = await prisma.user.update({
  where: { id: 'user1' },
  data: { name: 'Jonathan Doe' }
});
```

### Delete

```typescript
await prisma.user.delete({
  where: { id: 'user1' }
});
```

### Delete Many

```typescript
await prisma.user.deleteMany({
  where: { name: { contains: 'test' } }
});
```

---

## The Seed File

`prisma/seed.ts` populates initial data:

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create sample users
  await prisma.user.create({
    data: { id: 'user1', name: 'John Doe' }
  });
  await prisma.user.create({
    data: { id: 'user2', name: 'Jane Smith' }
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx prisma db seed
```

---

## Adding a New Field

1. **Edit schema.prisma**:
```prisma
model User {
  id    String @id @default(cuid())
  name  String
  email String?  // NEW: optional email field
}
```

2. **Create migration**:
```bash
npx prisma migrate dev --name add_email_field
```

3. **Use the new field**:
```typescript
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com'
  }
});
```

---

## Adding Relations

**One-to-many** (User has many Posts):

```prisma
model User {
  id    String @id @default(cuid())
  name  String
  posts Post[]  // One user has many posts
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
```

**Query with relations**:
```typescript
const userWithPosts = await prisma.user.findUnique({
  where: { id: 'user1' },
  include: { posts: true }
});
```

---

## Database File Location

The SQLite database is at:
```
prisma/dev.db
```

You can:
- View it with any SQLite browser (DB Browser, SQLiteStudio)
- Delete it to reset (then run `migrate dev` again)
- Copy it for backups

---

## Next Steps

- [API Reference](./README_API.md) - See how the database is exposed
- [Middleware Deep Dive](./README_Middleware.md) - Learn about request processing
