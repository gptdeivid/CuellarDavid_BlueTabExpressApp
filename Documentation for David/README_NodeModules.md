# 📦 Node Modules Explained

Everything you need to know about the project's dependencies.

---

## What is `package.json`?

The heart of any Node.js project. It defines:
- Project name and version
- Scripts (command shortcuts)
- Dependencies (packages your app needs)

```json
{
  "name": "ibm-express-microservice",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": { /* runtime packages */ },
  "devDependencies": { /* development-only packages */ }
}
```

---

## Production Dependencies

Packages needed when the application RUNS:

### `express` - Web Framework
The foundation of the project. Handles HTTP requests, routing, and middleware.

```typescript
import express from 'express';
const app = express();
app.get('/hello', (req, res) => res.send('Hello World'));
app.listen(3000);
```

**Used for**: Creating the web server, defining routes, handling requests.

---

### `@prisma/client` - Database ORM
Object-Relational Mapper that lets you query the database using JavaScript/TypeScript instead of raw SQL.

```typescript
// Instead of: SELECT * FROM users WHERE id = 'user1'
const user = await prisma.user.findUnique({
  where: { id: 'user1' }
});
```

**Used for**: All database operations (create, read, update, delete users).

---

### `@apollo/server` - GraphQL Server
Creates a GraphQL API alongside the REST API. Apollo is the most popular GraphQL implementation.

```typescript
const server = new ApolloServer({
  typeDefs,   // Schema (what data looks like)
  resolvers,  // Handlers (how to get data)
});
```

**Used for**: The `/graphql` endpoint.

---

### `graphql` - GraphQL Core
The core GraphQL library. Required by Apollo Server.

**Used for**: GraphQL query parsing and execution.

---

### `swagger-ui-express` - API Documentation UI
Renders interactive API documentation from OpenAPI/Swagger specifications.

```typescript
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

**Used for**: The `/api-docs` interactive documentation page.

---

### `yamljs` - YAML Parser
Parses YAML files into JavaScript objects.

```typescript
const config = YAML.load('swagger.yaml');
```

**Used for**: Loading the Swagger specification file.

---

## Development Dependencies

Packages needed only during DEVELOPMENT (not in production):

### `typescript` - TypeScript Compiler
Converts TypeScript code to JavaScript.

```bash
npm run build  # Runs: tsc
```

**Why TypeScript?** Adds type safety, catches errors before runtime.

---

### `ts-node` - TypeScript Runner
Runs TypeScript directly without compiling first. Great for development.

```bash
npm run dev  # Runs: ts-node src/index.ts
```

**Why use it?** Faster development cycle - no compile step needed.

---

### `prisma` - Prisma CLI
Command-line tool for database management.

```bash
npx prisma migrate dev   # Create/update database tables
npx prisma generate      # Generate client types
npx prisma studio        # Visual database browser
```

---

### `@types/*` Packages
TypeScript type definitions for JavaScript libraries:

| Package | Provides Types For |
|---------|-------------------|
| `@types/express` | Express framework |
| `@types/node` | Node.js built-ins (fs, path, etc.) |
| `@types/swagger-ui-express` | Swagger UI |
| `@types/yamljs` | YAML parser |

**Why needed?** TypeScript needs to know what types libraries use.

---

## The `node_modules` Folder

When you run `npm install`, all packages are downloaded here:

```
node_modules/
├── express/
├── @prisma/
│   └── client/
├── typescript/
├── (hundreds more...)
```

### Important Notes

- **Never commit this folder** - it's in `.gitignore`
- **Can be huge** - often 100MB+ for even simple projects
- **Fully recreatable** - just run `npm install` again
- **Contains nested dependencies** - packages have their own dependencies

---

## `package-lock.json`

Locks exact versions of EVERY package (including nested dependencies):

```json
{
  "express": {
    "version": "4.18.2",
    "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
    "integrity": "sha512-..."
  }
}
```

**Always commit this file!** Ensures everyone gets identical versions.

---

## Common npm Commands

| Command | What It Does |
|---------|--------------|
| `npm install` | Install all dependencies from package.json |
| `npm install lodash` | Add new production dependency |
| `npm install -D jest` | Add new dev dependency |
| `npm uninstall lodash` | Remove a dependency |
| `npm update` | Update packages to latest compatible versions |
| `npm outdated` | Show packages that can be updated |
| `npm run <script>` | Run a script from package.json |

---

## Scripts Explained

From this project's `package.json`:

```json
{
  "scripts": {
    "build": "tsc",                    // Compile TypeScript
    "start": "node dist/index.js",     // Run compiled code
    "dev": "ts-node src/index.ts",     // Run TypeScript directly
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev --name init",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

Run any script with `npm run <name>`:
```bash
npm run dev      # Start development server
npm run build    # Compile for production
```

---

## Semantic Versioning

Package versions follow `MAJOR.MINOR.PATCH`:

| Version | Meaning |
|---------|---------|
| 4.18.2 | Major: 4, Minor: 18, Patch: 2 |
| ^4.18.2 | Accept 4.x.x (minor/patch updates) |
| ~4.18.2 | Accept 4.18.x (patch updates only) |
| 4.18.2 | Exact version only |

The `^` prefix in package.json allows safe updates.

---

## Next Steps

- [Database & Prisma](./README_Database.md) - Deep dive into the ORM
- [TypeScript 101](./README_TypeScript101.md) - Learn TypeScript basics
