# 🔧 Middleware Deep Dive

Understanding how requests are processed before reaching your routes.

---

## What is Middleware?

Middleware are functions that run **between** receiving a request and sending a response:

```
Request → Middleware 1 → Middleware 2 → Route Handler → Response
```

Each middleware can:
- **Modify** the request/response objects
- **End** the request cycle (send a response)
- **Pass control** to the next middleware

---

## The Middleware Signature

Every middleware function has this shape:

```typescript
function middleware(req: Request, res: Response, next: NextFunction): void {
  // Do something with req/res
  next();  // Pass to next middleware
}
```

| Parameter | What It Is |
|-----------|------------|
| `req` | The incoming request (headers, body, params) |
| `res` | The response object (used to send data back) |
| `next` | Function to call the next middleware |

---

## Middleware Pipeline in This Project

```
Request
    │
    ▼
┌─────────────────────────────────┐
│     JSON Body Parser            │  Parses incoming JSON
│     express.json()              │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│     Domain Restriction          │  Checks Host header
│     domainRestriction.ts        │──→ 403 if blocked
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│     Route Handlers              │  Your actual logic
│     /users, /graphql, etc.      │
└─────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────┐
│     Error Handler               │  Catches any errors
│     errorHandler.ts             │
└─────────────────────────────────┘
    │
    ▼
Response
```

---

## Domain Restriction Middleware

**File:** `src/middleware/domainRestriction.ts`

**Purpose:** Only allow requests from trusted domains.

```typescript
export function domainRestriction(req: Request, res: Response, next: NextFunction): void {
  const host = req.headers.host || '';
  
  const allowedHosts = [
    'example.com',
    'www.example.com',
    'localhost:3000',
    '127.0.0.1:3000',
  ];

  // Check if host is allowed
  const isAllowed = allowedHosts.some(allowed => 
    host === allowed || host.endsWith(`.${allowed}`)
  );

  if (isAllowed) {
    next();  // ✅ Continue to route
  } else {
    res.status(403).json({  // ❌ Block request
      error: 'Forbidden',
      message: 'Access denied. This API only accepts traffic from example.com or localhost:3000.'
    });
  }
}
```

### How It Works

1. **Extract** the `Host` header from the request
2. **Check** if it matches any allowed host
3. **Allow** (call `next()`) OR **Block** (send 403 response)

---

## Error Handler Middleware

**File:** `src/middleware/errorHandler.ts`

**Purpose:** Catch all uncaught errors and return consistent error responses.

```typescript
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err.message);

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  // Generic 500 for unknown errors
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
}
```

### How It Works

1. **Catches** any error thrown in routes
2. **Checks** if it's a known `ApiError`
3. **Returns** appropriate status code and message

### Usage in Routes

```typescript
// Throw an ApiError in your route
if (!user) {
  throw new ApiError(404, 'User not found');
}
// The error handler catches this and returns 404
```

---

## Middleware Order Matters!

Middleware runs in the order it's registered:

```typescript
// ✅ Correct order
app.use(express.json());       // 1. Parse body first
app.use(domainRestriction);    // 2. Then check domain
app.use('/users', userRoutes); // 3. Then route
app.use(errorHandler);         // 4. Error handler LAST

// ❌ Wrong order - domain check before parsing
app.use(domainRestriction);    // Can't read parsed body yet!
app.use(express.json());
```

---

## Creating Your Own Middleware

### Logger Example

```typescript
function logger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
}

// Use it
app.use(logger);
```

### Authentication Example

```typescript
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;  // Attach user to request
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

---

## Route-Specific Middleware

Apply middleware only to specific routes:

```typescript
// Only on one route
router.get('/:id', validateId, getUserHandler);

// On all routes in a router
router.use(authenticate);
router.get('/profile', getProfile);
router.get('/settings', getSettings);
```

---

## The `next()` Function

Three ways to use `next()`:

```typescript
// 1. Continue to next middleware
next();

// 2. Skip to error handler
next(new Error('Something went wrong'));

// 3. Skip remaining middleware in this route
// (rare, just don't call next)
res.send('Done');  // No next() called
```

---

## Built-in Express Middleware

Express includes useful middleware:

| Middleware | Purpose |
|------------|---------|
| `express.json()` | Parse JSON request bodies |
| `express.urlencoded()` | Parse URL-encoded bodies |
| `express.static()` | Serve static files |
| `express.Router()` | Create modular routes |

---

## Third-Party Middleware

Popular community middleware:

| Package | Purpose |
|---------|---------|
| `cors` | Handle Cross-Origin Resource Sharing |
| `helmet` | Security headers |
| `morgan` | HTTP request logging |
| `compression` | Gzip compression |
| `express-rate-limit` | Rate limiting |

---

## Next Steps

- [TypeScript 101](./README_TypeScript101.md) - Understanding the type system
- [Design Decisions](./README_Justifications.md) - Why we chose this approach
