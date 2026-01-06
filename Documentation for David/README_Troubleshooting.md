# 🔍 Troubleshooting

Common issues and how to fix them.

---

## Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| "Module not found" | Run `npm install` |
| Database errors | Run `npx prisma migrate dev` |
| Types out of sync | Run `npx prisma generate` |
| Port in use | Kill process on port 3000 |
| Stale code | Restart the dev server |

---

## Installation Issues

### `npm install` fails

**Error:** Permission denied / EACCES

**Fix:**
```bash
# Windows: Run PowerShell as Administrator
# Or fix npm permissions
```

**Error:** Python/node-gyp errors

**Fix:** Some packages need build tools. On Windows:
```bash
npm install --global windows-build-tools
```

---

### TypeScript compilation errors

**Error:** `Cannot find module '@prisma/client'`

**Fix:**
```bash
npx prisma generate
```

**Error:** Type errors in IDE but build works

**Fix:** Restart your IDE or TypeScript server:
- VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

## Database Issues

### Migration fails

**Error:** `Database does not exist`

**Fix:**
```bash
npx prisma migrate dev
```

**Error:** `Migration has already been applied`

**Fix:** Reset the database:
```bash
npx prisma migrate reset
```

---

### Prisma Client errors

**Error:** `@prisma/client did not initialize yet`

**Fix:**
```bash
npx prisma generate
npm run dev  # Restart server
```

**Error:** `Table does not exist`

**Fix:**
```bash
npx prisma migrate dev
```

---

### Seeding fails

**Error:** `Unique constraint failed`

**Fix:** The seed tries to create users with IDs that already exist:
```bash
npx prisma migrate reset  # Resets and re-seeds
```

---

## Server Issues

### Port already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Fix (Windows PowerShell):**
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000

# Kill it
Stop-Process -Id <PID>
```

**Fix (Alternative):** Use a different port:
```typescript
// In src/index.ts
const PORT = 3001;  // Changed from 3000
```

---

### Server starts but no response

**Check 1:** Is the server actually running?
```bash
npm run dev
# Should see: 🚀 Server is running on http://localhost:3000
```

**Check 2:** Correct URL?
- REST: `http://localhost:3000/users/user1`
- GraphQL: `http://localhost:3000/graphql`
- Swagger: `http://localhost:3000/api-docs`

**Check 3:** Domain restriction blocking you?
```powershell
# Must include proper Host header
Invoke-RestMethod -Uri "http://localhost:3000/users/user1" -Headers @{Host="localhost:3000"}
```

---

## API Issues

### 403 Forbidden

**Cause:** Domain restriction middleware is blocking the request.

**Fix:** Include the correct `Host` header:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/users/user1" -Headers @{Host="localhost:3000"}
```

**Allowed hosts:**
- `localhost:3000`
- `example.com`

---

### 404 Not Found

**Cause (REST):** User ID doesn't exist in database.

**Fix:** Check available users:
```powershell
Invoke-RestMethod "http://localhost:3000/users/user1"
Invoke-RestMethod "http://localhost:3000/users/user2"
Invoke-RestMethod "http://localhost:3000/users/user3"
```

Or check directly in Prisma Studio:
```bash
npx prisma studio
```

---

### GraphQL returns null

**Query works but returns `null`:**
```json
{
  "data": {
    "user": null
  }
}
```

**Cause:** User doesn't exist.

**Fix:** Verify the ID exists:
```graphql
# Try user1, user2, or user3
{
  user(id: "user1") {
    id
    name
  }
}
```

---

### Swagger UI blank

**Cause:** `swagger.yaml` failed to load.

**Check:** Does the file exist?
```bash
ls swagger.yaml
```

**Check:** Valid YAML syntax?
Try pasting content into: https://jsonformatter.org/yaml-validator

---

## Development Issues

### Changes not reflecting

**Cause:** Server needs restart.

**Fix:**
1. Stop the server (`Ctrl + C`)
2. Start again (`npm run dev`)

**Alternative:** Use a file watcher like `nodemon`:
```bash
npm install -D nodemon
# Add to scripts: "dev": "nodemon --exec ts-node src/index.ts"
```

---

### TypeScript errors not showing

**Cause:** IDE not synced with tsconfig.

**Fix:**
1. Save all files
2. Restart TypeScript server in VS Code
3. Run `npm run build` to see all errors

---

## Environment Issues

### Wrong Node version

**Error:** `SyntaxError: Unexpected token`

**Check version:**
```bash
node --version  # Should be 18+
```

**Fix:** Update Node.js from https://nodejs.org/

---

### PowerShell execution policy

**Error:** `script cannot be loaded because running scripts is disabled`

**Fix (Run PowerShell as Admin):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Still Stuck?

### Debug Steps

1. **Read the error** - Most errors tell you exactly what's wrong
2. **Check the logs** - Server output shows detailed errors
3. **Simplify** - Remove code until it works, then add back
4. **Google the error** - Copy/paste the exact error message

### Reset Everything

Nuclear option - start fresh:
```bash
# Remove node_modules and database
rm -rf node_modules
rm prisma/dev.db

# Reinstall and recreate
npm install
npx prisma migrate dev
npm run dev
```

---

## Helpful Commands Reference

| Command | What It Does |
|---------|--------------|
| `npm run dev` | Start dev server |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma migrate dev` | Apply database migrations |
| `npx prisma migrate reset` | Reset database completely |
| `npx prisma studio` | Open visual database browser |
| `npm run build` | Check for TypeScript errors |
