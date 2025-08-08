export interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token?: string;
}

export interface AuthResponse {
  user?: User | null;
  session?: Session | null;
  error?: any;
}

export interface DatabaseAdapter {
  // Authentication methods
  signUp(email: string, password: string, options?: any): Promise<AuthResponse>;
  signInWithPassword(email: string, password: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getSession(): Promise<{ session: Session | null }>;
  onAuthStateChange(callback: (event: string, session: Session | null) => void): { subscription: { unsubscribe: () => void } };
  
  // Database methods
  from(table: string): DatabaseQuery;
  
  // Functions (Edge functions for Supabase, custom functions for PostgreSQL)
  functions: {
    invoke(functionName: string, options: { body: any }): Promise<{ data: any; error: any }>;
  };
}

export interface DatabaseQuery {
  select(columns?: string): DatabaseQuery;
  insert(values: any): DatabaseQuery;
  update(values: any): DatabaseQuery;
  delete(): DatabaseQuery;
  eq(column: string, value: any): DatabaseQuery;
  neq(column: string, value: any): DatabaseQuery;
  gt(column: string, value: any): DatabaseQuery;
  gte(column: string, value: any): DatabaseQuery;
  lt(column: string, value: any): DatabaseQuery;
  lte(column: string, value: any): DatabaseQuery;
  like(column: string, pattern: string): DatabaseQuery;
  ilike(column: string, pattern: string): DatabaseQuery;
  in(column: string, values: any[]): DatabaseQuery;
  order(column: string, options?: { ascending?: boolean }): DatabaseQuery;
  limit(count: number): DatabaseQuery;
  single(): Promise<{ data: any; error: any }>;
  maybeSingle(): Promise<{ data: any; error: any }>;
  then(resolve: (result: { data: any; error: any }) => void): Promise<any>;
}

export type DatabaseProvider = 'supabase' | 'postgresql';