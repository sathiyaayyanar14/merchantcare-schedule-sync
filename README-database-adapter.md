# Database Adapter Configuration

This project now supports both Supabase and self-hosted PostgreSQL databases through a unified database adapter interface.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

### For Supabase (Default)
```bash
VITE_DB_PROVIDER=supabase
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### For PostgreSQL
```bash
VITE_DB_PROVIDER=postgresql
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=your_database_name
VITE_DB_USER=your_username
VITE_DB_PASSWORD=your_password
VITE_DB_SSL=false
```

## Required Database Schema for PostgreSQL

If you're using PostgreSQL, you'll need to create the following tables:

```sql
-- Users table for authentication
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add any other application-specific tables here
```

## Usage

The database adapter provides a unified interface regardless of the provider:

```typescript
import { getDatabase } from '@/lib/database';

const database = getDatabase();

// Authentication
const { user, session, error } = await database.signUp(email, password, options);
const { user, session, error } = await database.signInWithPassword(email, password);
await database.signOut();

// Database queries
const { data, error } = await database.from('table_name').select('*');
const { data, error } = await database.from('table_name').insert(values);

// Functions/Edge Functions
const { data, error } = await database.functions.invoke('function_name', { body: data });
```

## Switching Between Providers

1. Update the `VITE_DB_PROVIDER` environment variable
2. Restart your application
3. The adapter will automatically use the correct provider

## Implementation Notes

### Authentication Differences

- **Supabase**: Uses Supabase Auth with full OAuth support, email verification, etc.
- **PostgreSQL**: Uses a simple email/password system (you may want to enhance this with proper password hashing using bcrypt)

### Function Calls

- **Supabase**: Maps to Supabase Edge Functions
- **PostgreSQL**: Maps to PostgreSQL stored procedures/functions

### Security Considerations

The PostgreSQL adapter currently uses a simplified authentication system. For production use, you should:

1. Implement proper password hashing (bcrypt)
2. Add session management with JWTs
3. Implement proper user roles and permissions
4. Add rate limiting
5. Use prepared statements to prevent SQL injection

## Development vs Production

- **Development**: You can use either provider for testing
- **Production**: Make sure your environment variables are properly set and your database is secured

## Migration

If you're migrating from Supabase to PostgreSQL:

1. Export your data from Supabase
2. Set up your PostgreSQL database with the required schema
3. Import your data
4. Update your environment variables
5. Test all functionality

The application code remains the same thanks to the adapter pattern.