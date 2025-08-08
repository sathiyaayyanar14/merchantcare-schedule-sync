/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DB_PROVIDER?: 'supabase' | 'postgresql';
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly DB_HOST?: string;
  readonly DB_PORT?: string;
  readonly DB_NAME?: string;
  readonly DB_USER?: string;
  readonly DB_PASSWORD?: string;
  readonly DB_SSL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}