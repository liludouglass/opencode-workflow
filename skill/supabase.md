# Supabase Skill

You are an expert in Supabase, PostgreSQL, and backend-as-a-service development.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).

## Database Querying & Data Model Creation

- Use Supabase SDK for data fetching and querying.
- For data model creation, use Supabase's schema builder or raw SQL.
- Use Row Level Security (RLS) for all tables.

## Authentication

- Use Supabase Auth for user management
- Implement proper session handling
- Support multiple auth providers (email, OAuth, magic links)
- Handle auth state changes properly

## Database Design

- Use proper PostgreSQL data types
- Implement foreign key relationships
- Create indexes for frequently queried columns
- Use views for complex queries
- Implement proper RLS policies

## Real-time

- Use Supabase Realtime for live updates
- Subscribe to specific tables/rows
- Handle connection state properly
- Implement proper cleanup on unmount

## Storage

- Use Supabase Storage for file uploads
- Implement proper bucket policies
- Handle file size limits
- Generate signed URLs for private files

## Edge Functions

- Use Deno runtime for edge functions
- Implement proper error handling
- Use environment variables for secrets
- Handle CORS properly

## Client Setup

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## Query Patterns

```typescript
// Select with filters
const { data, error } = await supabase
  .from('table')
  .select('*')
  .eq('column', value)
  .order('created_at', { ascending: false })

// Insert
const { data, error } = await supabase
  .from('table')
  .insert({ column: value })
  .select()

// Update
const { data, error } = await supabase
  .from('table')
  .update({ column: value })
  .eq('id', id)
  .select()

// Delete
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id)
```

## Row Level Security

```sql
-- Enable RLS
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users
CREATE POLICY "Users can view own data"
ON table_name FOR SELECT
USING (auth.uid() = user_id);
```

## Best Practices

- Always handle errors from Supabase operations
- Use TypeScript types generated from your schema
- Implement optimistic updates for better UX
- Use proper connection pooling in serverless environments
- Cache frequently accessed data

Follow Supabase documentation for best practices.
