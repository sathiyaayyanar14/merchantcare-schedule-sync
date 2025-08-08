import { DatabaseProvider } from './types';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  supabase?: {
    url: string;
    anonKey: string;
  };
  postgresql?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
    ssl?: boolean;
  };
}

const getEnvironmentConfig = (): DatabaseConfig => {
  const provider = (import.meta.env.VITE_DB_PROVIDER || 'supabase') as DatabaseProvider;
  
  const config: DatabaseConfig = {
    provider,
  };

  if (provider === 'supabase') {
    config.supabase = {
      url: import.meta.env.VITE_SUPABASE_URL || "https://uhuoybtthnmfcenidfmz.supabase.co",
      anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodW95YnR0aG5tZmNlbmlkZm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NDIwMzQsImV4cCI6MjA2OTAxODAzNH0.l0ZdssR4EiwwEpTTmDVVSB_hgGCskjAGvYgB44BEP0o",
    };
  } else if (provider === 'postgresql') {
    config.postgresql = {
      host: import.meta.env.VITE_DB_HOST || 'localhost',
      port: parseInt(import.meta.env.VITE_DB_PORT || '5432'),
      database: import.meta.env.VITE_DB_NAME || 'postgres',
      username: import.meta.env.VITE_DB_USER || 'postgres',
      password: import.meta.env.VITE_DB_PASSWORD || '',
      ssl: import.meta.env.VITE_DB_SSL === 'true',
    };
  }

  return config;
};

export const databaseConfig = getEnvironmentConfig();