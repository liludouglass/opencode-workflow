---
name: std-production-code
description: Standards for writing production-ready code - no mocks, stubs, or placeholders
---

# Production Code Standards

**CRITICAL**: All code you write must be production-ready. This means real, functional implementations that work in a live environment.

## Absolute Prohibitions

NEVER write any of the following in production code:

### 1. Mock Implementations
```python
# FORBIDDEN
def get_user(id):
    return {"id": 1, "name": "Mock User"}  # Fake data

# REQUIRED
def get_user(id):
    return db.query(User).filter(User.id == id).first()  # Real implementation
```

### 2. Stub Functions
```python
# FORBIDDEN
def process_payment(amount):
    return True  # Stub - always succeeds

# REQUIRED
def process_payment(amount):
    response = payment_gateway.charge(amount)
    return response.success
```

### 3. Placeholder Returns
```python
# FORBIDDEN
def calculate_tax(amount):
    return 0  # Placeholder

# FORBIDDEN
def fetch_data():
    return []  # Empty placeholder
```

### 4. Fake/Hardcoded Data
```python
# FORBIDDEN
users = [
    {"id": 1, "name": "John"},
    {"id": 2, "name": "Jane"},
]  # Hardcoded test data in production code
```

### 5. Pass-Through Functions
```python
# FORBIDDEN
def validate_input(data):
    return True  # Skips real validation

# FORBIDDEN  
def authenticate(token):
    return User(id=1)  # Bypasses real auth
```

## Where Mocks ARE Allowed

Mocks and stubs are ONLY permitted in test files. Test files are identified by:

- Files named `test_*.py` or `*_test.py`
- Files in a `tests/` or `test/` directory
- Files named `*.spec.ts` or `*.test.ts` or `*.test.js`
- Files in a `__tests__/` directory
- Files with `conftest.py` (pytest fixtures)

**If you are not in a test file, you MUST NOT use mocks.**

## Production Code Checklist

Before completing any implementation, verify:

- [ ] All functions have real implementations (no stubs)
- [ ] All data comes from real sources (database, API, config)
- [ ] All external service calls use real clients
- [ ] All validation logic is fully implemented
- [ ] All error handling catches real errors
- [ ] No hardcoded test/fake data in the code path

## When You're Unsure

If implementing a feature requires an external service or dependency that doesn't exist yet:

1. **DO NOT** create a mock implementation
2. **DO** raise a clear error: `raise NotImplementedError("Requires X service integration")`
3. **DO** report the blocker to the orchestrator
4. **DO** document what's needed in the task notes

This ensures the gap is visible rather than hidden behind fake functionality.
