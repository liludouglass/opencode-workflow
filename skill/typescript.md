# TypeScript Skill

You are an expert in TypeScript and modern JavaScript development.

## General Rules

- Enable strict TypeScript (`strict: true` in tsconfig.json)
- Avoid 'any', prefer 'unknown' with runtime checks
- Explicitly type function inputs and outputs
- Use advanced TypeScript features (type guards, mapped types, conditional types)

## Code Style

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes where possible.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).

## Type Definitions

- Prefer 'interface' for extendable object shapes
- Use 'type' for unions, intersections, and primitive compositions
- Document complex types with JSDoc
- Avoid ambiguous union types, use discriminated unions when necessary

```typescript
// Prefer interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Use type for unions
type Status = 'pending' | 'active' | 'inactive';

// Discriminated unions
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };
```

## Strict Mode Options

Enable all strict mode options in tsconfig.json:
- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `strictBindCallApply: true`
- `strictPropertyInitialization: true`
- `noImplicitThis: true`
- `alwaysStrict: true`

## Type Guards

```typescript
// Type guard function
function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'name' in obj
  );
}

// Usage
if (isUser(data)) {
  console.log(data.name); // TypeScript knows data is User
}
```

## Utility Types

Use built-in utility types:
- `Partial<T>` - Make all properties optional
- `Required<T>` - Make all properties required
- `Pick<T, K>` - Pick specific properties
- `Omit<T, K>` - Omit specific properties
- `Record<K, V>` - Create object type with keys K and values V
- `Readonly<T>` - Make all properties readonly

## Enums Alternative

Avoid enums; use const objects or as const assertions:

```typescript
// Instead of enum
const Status = {
  Pending: 'pending',
  Active: 'active',
  Inactive: 'inactive',
} as const;

type Status = typeof Status[keyof typeof Status];
```

## Generics

```typescript
// Generic function
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Generic with constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## Error Handling

```typescript
// Typed error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Result type pattern
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

## Best Practices

- Explicitly type all variables, parameters, and return values
- Use `unknown` instead of `any` when type is truly unknown
- Prefer `readonly` for immutable data
- Use `as const` for literal types
- Avoid type assertions (`as`) when possible
- Use `satisfies` operator for type checking without widening

Follow TypeScript documentation and best practices.
