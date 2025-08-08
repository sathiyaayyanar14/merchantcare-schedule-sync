import { createClient } from '@supabase/supabase-js';
import { DatabaseAdapter, DatabaseQuery, AuthResponse, Session, User } from '../types';
import { DatabaseConfig } from '../config';

class SupabaseQuery implements DatabaseQuery {
  private query: any;

  constructor(query: any) {
    this.query = query;
  }

  select(columns?: string): DatabaseQuery {
    return new SupabaseQuery(this.query.select(columns));
  }

  insert(values: any): DatabaseQuery {
    return new SupabaseQuery(this.query.insert(values));
  }

  update(values: any): DatabaseQuery {
    return new SupabaseQuery(this.query.update(values));
  }

  delete(): DatabaseQuery {
    return new SupabaseQuery(this.query.delete());
  }

  eq(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.eq(column, value));
  }

  neq(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.neq(column, value));
  }

  gt(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.gt(column, value));
  }

  gte(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.gte(column, value));
  }

  lt(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.lt(column, value));
  }

  lte(column: string, value: any): DatabaseQuery {
    return new SupabaseQuery(this.query.lte(column, value));
  }

  like(column: string, pattern: string): DatabaseQuery {
    return new SupabaseQuery(this.query.like(column, pattern));
  }

  ilike(column: string, pattern: string): DatabaseQuery {
    return new SupabaseQuery(this.query.ilike(column, pattern));
  }

  in(column: string, values: any[]): DatabaseQuery {
    return new SupabaseQuery(this.query.in(column, values));
  }

  order(column: string, options?: { ascending?: boolean }): DatabaseQuery {
    return new SupabaseQuery(this.query.order(column, options));
  }

  limit(count: number): DatabaseQuery {
    return new SupabaseQuery(this.query.limit(count));
  }

  async single(): Promise<{ data: any; error: any }> {
    return await this.query.single();
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
    return await this.query.maybeSingle();
  }

  async then(resolve: (result: { data: any; error: any }) => void): Promise<any> {
    const result = await this.query;
    return resolve(result);
  }
}

export class SupabaseAdapter implements DatabaseAdapter {
  private client: any;

  constructor(config: DatabaseConfig) {
    if (!config.supabase) {
      throw new Error('Supabase configuration is required');
    }
    
    this.client = createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        storage: localStorage,
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  }

  async signUp(email: string, password: string, options?: any): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options,
    });
    
    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      user: data.user,
      session: data.session,
      error,
    };
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getSession(): Promise<{ session: Session | null }> {
    const { data } = await this.client.auth.getSession();
    return { session: data.session };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): { subscription: { unsubscribe: () => void } } {
    return this.client.auth.onAuthStateChange(callback);
  }

  from(table: string): DatabaseQuery {
    return new SupabaseQuery(this.client.from(table));
  }

  get functions() {
    return {
      invoke: async (functionName: string, options: { body: any }) => {
        return await this.client.functions.invoke(functionName, options);
      },
    };
  }
}