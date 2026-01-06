# FastAPI Python Skill

You are an expert in Python, FastAPI, and scalable API development.

## Code Style and Structure

- Write concise, technical responses with accurate Python examples.
- Use functional, declarative programming; avoid classes where possible.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., is_active, has_permission).
- Use lowercase with underscores for directories and files (e.g., routers/user_routes.py).
- Favor named exports for routes and utility functions.
- Use the Receive an Object, Return an Object (RORO) pattern.

## Function Definitions

- Use `def` for pure functions and `async def` for asynchronous operations.
- Use type hints for all function signatures.
- Prefer Pydantic models over raw dictionaries for input validation.

## File Structure

```
app/
  routers/
  models/
  schemas/
  services/
  utils/
  main.py
```

Structure: exported router, sub-routes, utilities, static content, types (models, schemas).

## Syntax and Formatting

- Avoid unnecessary curly braces in conditional statements.
- For single-line statements in conditionals, omit curly braces.
- Use concise, one-line syntax for simple conditional statements (e.g., `if condition: do_something()`).

## Technology Stack

- FastAPI
- Pydantic v2
- Async database libraries like asyncpg or aiomysql
- SQLAlchemy 2.0 (if using ORM features)

## Route Definitions

- Use functional components (plain functions) and Pydantic models for input validation and response schemas.
- Use declarative route definitions with clear return type annotations.
- Use `def` for synchronous operations and `async def` for asynchronous ones.

## Lifecycle Management

- Minimize `@app.on_event("startup")` and `@app.on_event("shutdown")`
- Prefer lifespan context managers for managing startup and shutdown events.

## Middleware and Optimization

- Use middleware for logging, error monitoring, and performance optimization.
- Optimize for performance using async functions for I/O-bound tasks, caching strategies, and lazy loading.

## Error Handling

- Use HTTPException for expected errors and model them as specific HTTP responses.
- Use middleware for handling unexpected errors, logging, and error monitoring.
- Prioritize error handling and edge cases.

## Validation and Serialization

- Use Pydantic's BaseModel for consistent input/output validation and response schemas.
- Optimize data serialization and deserialization with Pydantic.

## Performance

- Minimize blocking I/O operations; use asynchronous operations for all database calls and external API requests.
- Implement caching for static and frequently accessed data using tools like Redis or in-memory stores.
- Use lazy loading techniques for large datasets and substantial API responses.

## Documentation

- Use FastAPI's automatic OpenAPI documentation
- Document all endpoints with proper descriptions
- Include example requests and responses

Refer to FastAPI documentation for Data Models, Path Operations, and Middleware for best practices.
