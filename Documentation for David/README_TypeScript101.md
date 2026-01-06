# 📘 TypeScript 101

A beginner's guide to TypeScript, the language used in this project.

---

## What is TypeScript?

TypeScript is **JavaScript with types**. It adds optional type checking that catches errors before your code runs.

```javascript
// JavaScript - no errors until runtime
function add(a, b) {
  return a + b;
}
add("5", 3);  // Returns "53" (string concatenation!) 
```

```typescript
// TypeScript - catches error at compile time
function add(a: number, b: number): number {
  return a + b;
}
add("5", 3);  // ❌ Error: Argument of type 'string' is not assignable
```

---

## Basic Types

### Primitive Types

```typescript
// Strings
const name: string = "John";

// Numbers (integers and floats)
const age: number = 25;
const price: number = 19.99;

// Booleans
const isActive: boolean = true;

// Null and Undefined
const nothing: null = null;
const notDefined: undefined = undefined;
```

### Arrays

```typescript
// Array of strings
const names: string[] = ["John", "Jane"];

// Array of numbers
const scores: number[] = [95, 87, 91];

// Alternative syntax
const items: Array<string> = ["a", "b"];
```

### Objects

```typescript
// Object with defined shape
const user: { id: string; name: string } = {
  id: "123",
  name: "John"
};
```

---

## Type Aliases and Interfaces

### Type Alias

Create reusable type definitions:

```typescript
type User = {
  id: string;
  name: string;
  email?: string;  // ? means optional
};

const user: User = { id: "1", name: "John" };
```

### Interface

Similar to type aliases, preferred for object shapes:

```typescript
interface User {
  id: string;
  name: string;
  email?: string;
}

const user: User = { id: "1", name: "John" };
```

---

## Functions

### Typed Functions

```typescript
// Parameter types and return type
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function
const add = (a: number, b: number): number => a + b;
```

### Optional Parameters

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || 'Hello'}, ${name}!`;
}

greet("John");           // "Hello, John!"
greet("John", "Hi");     // "Hi, John!"
```

### Default Parameters

```typescript
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}
```

---

## Union Types

A value can be one of several types:

```typescript
// String OR number
let id: string | number;
id = "abc";  // ✅
id = 123;    // ✅
id = true;   // ❌ Error

// Null handling
function findUser(id: string): User | null {
  // May return User or null
}
```

---

## Type Narrowing

TypeScript understands your checks:

```typescript
function process(value: string | number) {
  if (typeof value === "string") {
    // TypeScript knows value is string here
    console.log(value.toUpperCase());
  } else {
    // TypeScript knows value is number here
    console.log(value.toFixed(2));
  }
}
```

---

## Classes

### Basic Class

```typescript
class User {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  greet(): string {
    return `Hello, ${this.name}`;
  }
}

const user = new User("1", "John");
user.greet();  // "Hello, John"
```

### Access Modifiers

```typescript
class User {
  public id: string;           // Accessible anywhere (default)
  private password: string;    // Only accessible inside class
  protected email: string;     // Accessible in class and subclasses
  readonly createdAt: Date;    // Can't be modified after creation

  constructor(id: string) {
    this.id = id;
    this.password = "secret";
    this.createdAt = new Date();
  }
}

const user = new User("1");
user.id;        // ✅ Public
user.password;  // ❌ Error: private
```

### Static Members

```typescript
class App {
  private static instance: App;

  private constructor() {}

  static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }
}

App.getInstance();  // Works
new App();          // ❌ Error: private constructor
```

---

## Generics

Make types reusable with type parameters:

```typescript
// Generic function
function firstItem<T>(items: T[]): T | undefined {
  return items[0];
}

firstItem<string>(["a", "b"]);  // Returns string
firstItem<number>([1, 2, 3]);   // Returns number

// TypeScript can infer the type
firstItem(["a", "b"]);  // Inferred as string
```

### Generic Interfaces

```typescript
interface Response<T> {
  data: T;
  error: string | null;
}

const userResponse: Response<User> = {
  data: { id: "1", name: "John" },
  error: null
};
```

---

## Async/Await

TypeScript supports async/await with proper types:

```typescript
// Returns a Promise of User or null
async function findUser(id: string): Promise<User | null> {
  const user = await database.find(id);
  return user;
}

// Using the function
const user = await findUser("123");
if (user) {
  console.log(user.name);  // TypeScript knows user is not null
}
```

---

## Type Assertions

Tell TypeScript "I know better" (use sparingly):

```typescript
// HTMLElement to HTMLInputElement
const input = document.getElementById("email") as HTMLInputElement;
input.value = "test@example.com";

// Unknown to specific type (careful!)
const data = JSON.parse(response) as User;
```

---

## Common TypeScript in This Project

### Express Types

```typescript
import { Request, Response, NextFunction } from 'express';

function middleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // req has proper types for headers, body, params
  const host = req.headers.host;  // string | undefined
  next();
}
```

### Prisma Types

```typescript
// Auto-generated from schema
import { User } from '@prisma/client';

async function findUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}
```

---

## Configuration: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",          // JavaScript version to output
    "module": "commonjs",        // Module system
    "strict": true,              // Enable all strict checks
    "esModuleInterop": true,     // Better import compatibility
    "outDir": "./dist",          // Compiled output folder
    "rootDir": "."               // Source root
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## Key Takeaways

| Concept | What It Does |
|---------|--------------|
| Types | Catch errors before runtime |
| Interfaces | Define object shapes |
| Generics | Create reusable typed components |
| Access modifiers | Control visibility |
| Async types | Type safety for promises |

---

## Next Steps

- [Design Decisions](./README_Justifications.md) - Why these choices?
- [Troubleshooting](./README_Troubleshooting.md) - Common issues
