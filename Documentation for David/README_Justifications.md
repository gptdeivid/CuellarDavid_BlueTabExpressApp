# 🎯 Design Decisions

Why we made specific technology and architecture choices.

---

## Why TypeScript?

### The Problem with Plain JavaScript

```javascript
// JavaScript offers no type safety
function getUser(id) {
  return database.find(id);
}

getUser(123);      // Works
getUser("123");    // Also works... but might break
getUser(null);     // Runtime crash!
```

### TypeScript Solution

```typescript
// TypeScript catches errors at compile time
function getUser(id: string): User | null {
  return database.find(id);
}

getUser(123);      // ❌ Error before running
getUser("123");    // ✅ Works
getUser(null);     // ❌ Error before running
```

**Benefits:**
- Catch bugs before deployment
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring

---

## Why Singleton Pattern?

### The Problem Without Singleton

```typescript
// Multiple app instances can cause chaos
const app1 = new App();  // Server 1
const app2 = new App();  // Server 2! Port conflict!
```

### Singleton Solution

```typescript
// Only one instance ever
const app1 = App.getInstance();  // Creates instance
const app2 = App.getInstance();  // Returns SAME instance
app1 === app2;  // true
```

**Benefits:**
| Without Singleton | With Singleton |
|-------------------|----------------|
| Multiple servers possible | Guaranteed single server |
| Middleware runs multiple times | Runs once |
| Memory waste | Memory efficient |
| Configuration inconsistency | Single source of truth |

---

## Why Prisma Over Other ORMs?

### Options Considered

| ORM | Pros | Cons |
|-----|------|------|
| **Prisma** ✅ | Type-safe, great DX, migrations | Newer ecosystem |
| Sequelize | Mature, large community | Verbose, weak types |
| TypeORM | Feature-rich | Complex decorators |
| Knex | SQL-like | Not full ORM |

### Why Prisma Won

1. **Auto-generated types** - Schema → TypeScript types automatically
2. **Migration system** - Tracks schema changes like version control
3. **Prisma Studio** - Visual database browser for debugging
4. **Declarative schema** - Easy to read and maintain
5. **Great error messages** - Tells you exactly what's wrong

---

## Why SQLite?

For this **demo project**, SQLite is perfect:

| Feature | SQLite | PostgreSQL |
|---------|--------|------------|
| Setup | Zero (just a file) | Needs server |
| Development | Instant | Configuration |
| Testing | Easy to reset | More complex |
| Portability | Copy file | Dump/restore |
| Production | Limited | Recommended |

### Switching to PostgreSQL Later

Just change one line in `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Prisma handles all the differences!

---

## Why Both REST and GraphQL?

### Different Strengths

| Scenario | Best Choice |
|----------|-------------|
| Simple CRUD operations | REST |
| Mobile apps (bandwidth matters) | GraphQL |
| Third-party integrations | REST |
| Complex nested data | GraphQL |
| HTTP caching needed | REST |
| Flexible frontend needs | GraphQL |

### Why Support Both?

1. **Flexibility** - Clients choose what fits their needs
2. **Learning** - Compare both paradigms in one project
3. **Real-world pattern** - Many companies offer both
4. **Same data source** - Both use Prisma, no duplication

---

## Why Domain Restriction Middleware?

### The Security Need

Without restriction, anyone can call your API:

```
✅ localhost:3000 → Your frontend during development
✅ example.com → Your production frontend
❌ evil.com → Malicious site
❌ competitor.com → Data scraping
```

### Why Not Just Use CORS?

| Mechanism | Enforcement | Limitation |
|-----------|-------------|------------|
| CORS | Browser only | curl/Postman bypass it |
| **Server middleware** | All clients | Works everywhere |

CORS is client-side; our middleware is server-side and can't be bypassed.

---

## Why This Project Structure?

```
src/
├── app/          # Core application (Singleton)
├── middleware/   # Cross-cutting concerns
├── routes/       # HTTP layer
├── graphql/      # GraphQL layer
├── services/     # Business logic
└── index.ts      # Entry point
```

### Layered Architecture Benefits

1. **Separation of Concerns** - Each file has ONE job
2. **Testability** - Services can be tested without HTTP
3. **Maintainability** - Changes stay localized
4. **Reusability** - Services used by both REST and GraphQL

---

## Why Swagger/OpenAPI?

### The Problem

Without documentation:
- "What endpoints exist?"
- "What parameters are needed?"
- "What does the response look like?"

### Swagger Solution

- Interactive documentation at `/api-docs`
- Try requests in the browser
- Machine-readable specification
- Generates client SDKs
- Always up-to-date with the code

---

## Tradeoffs Acknowledged

Every decision has tradeoffs:

| Decision | Tradeoff |
|----------|----------|
| TypeScript | Learning curve, build step required |
| Singleton | Can't run multiple instances (rarely needed) |
| SQLite | Not suitable for production (easily changed) |
| Prisma | Newer than alternatives, specific to Node.js |
| Domain restriction | Needs proper reverse proxy config in production |

These tradeoffs were accepted for:
- **Clarity** - Easier to understand
- **Safety** - Type checking catches bugs
- **Simplicity** - Minimal setup required
- **Learning** - Good patterns for real projects

---

## Next Steps

- [Troubleshooting](./README_Troubleshooting.md) - Common issues and solutions
- [Architecture](./README_Architecture.md) - How it all fits together
