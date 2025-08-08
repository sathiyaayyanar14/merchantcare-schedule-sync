import { Pool } from 'pg';
import { DatabaseAdapter, DatabaseQuery, AuthResponse, Session, User } from '../types';
import { DatabaseConfig } from '../config';

// Simple authentication state management for PostgreSQL
class PostgreSQLAuth {
  private currentUser: User | null = null;
  private currentSession: Session | null = null;
  private listeners: Array<(event: string, session: Session | null) => void> = [];

  setSession(session: Session | null) {
    this.currentSession = session;
    this.currentUser = session?.user || null;
    this.listeners.forEach(listener => listener('SIGNED_IN', session));
  }

  clearSession() {
    this.currentSession = null;
    this.currentUser = null;
    this.listeners.forEach(listener => listener('SIGNED_OUT', null));
  }

  getSession() {
    return this.currentSession;
  }

  getUser() {
    return this.currentUser;
  }

  addListener(callback: (event: string, session: Session | null) => void) {
    this.listeners.push(callback);
    return {
      unsubscribe: () => {
        const index = this.listeners.indexOf(callback);
        if (index > -1) this.listeners.splice(index, 1);
      }
    };
  }
}

class PostgreSQLQuery implements DatabaseQuery {
  private pool: Pool;
  private tableName: string;
  private selectColumns: string = '*';
  private conditions: string[] = [];
  private orderBy: string = '';
  private limitCount: number | null = null;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private insertValues: any = null;
  private updateValues: any = null;

  constructor(pool: Pool, tableName: string) {
    this.pool = pool;
    this.tableName = tableName;
  }

  select(columns: string = '*'): DatabaseQuery {
    this.operation = 'select';
    this.selectColumns = columns;
    return this;
  }

  insert(values: any): DatabaseQuery {
    this.operation = 'insert';
    this.insertValues = values;
    return this;
  }

  update(values: any): DatabaseQuery {
    this.operation = 'update';
    this.updateValues = values;
    return this;
  }

  delete(): DatabaseQuery {
    this.operation = 'delete';
    return this;
  }

  eq(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} = '${value}'`);
    return this;
  }

  neq(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} != '${value}'`);
    return this;
  }

  gt(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} > '${value}'`);
    return this;
  }

  gte(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} >= '${value}'`);
    return this;
  }

  lt(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} < '${value}'`);
    return this;
  }

  lte(column: string, value: any): DatabaseQuery {
    this.conditions.push(`${column} <= '${value}'`);
    return this;
  }

  like(column: string, pattern: string): DatabaseQuery {
    this.conditions.push(`${column} LIKE '${pattern}'`);
    return this;
  }

  ilike(column: string, pattern: string): DatabaseQuery {
    this.conditions.push(`${column} ILIKE '${pattern}'`);
    return this;
  }

  in(column: string, values: any[]): DatabaseQuery {
    const valueList = values.map(v => `'${v}'`).join(', ');
    this.conditions.push(`${column} IN (${valueList})`);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }): DatabaseQuery {
    const direction = options?.ascending === false ? 'DESC' : 'ASC';
    this.orderBy = `ORDER BY ${column} ${direction}`;
    return this;
  }

  limit(count: number): DatabaseQuery {
    this.limitCount = count;
    return this;
  }

  private buildQuery(): string {
    let query = '';
    const whereClause = this.conditions.length > 0 ? `WHERE ${this.conditions.join(' AND ')}` : '';
    const limitClause = this.limitCount ? `LIMIT ${this.limitCount}` : '';

    switch (this.operation) {
      case 'select':
        query = `SELECT ${this.selectColumns} FROM ${this.tableName} ${whereClause} ${this.orderBy} ${limitClause}`.trim();
        break;
      case 'insert':
        if (this.insertValues) {
          const columns = Object.keys(this.insertValues).join(', ');
          const values = Object.values(this.insertValues).map(v => `'${v}'`).join(', ');
          query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values}) RETURNING *`;
        }
        break;
      case 'update':
        if (this.updateValues) {
          const setPairs = Object.entries(this.updateValues).map(([k, v]) => `${k} = '${v}'`).join(', ');
          query = `UPDATE ${this.tableName} SET ${setPairs} ${whereClause} RETURNING *`;
        }
        break;
      case 'delete':
        query = `DELETE FROM ${this.tableName} ${whereClause} RETURNING *`;
        break;
    }

    return query;
  }

  async single(): Promise<{ data: any; error: any }> {
    try {
      const query = this.buildQuery();
      const result = await this.pool.query(query);
      return { data: result.rows[0] || null, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async maybeSingle(): Promise<{ data: any; error: any }> {
    return this.single();
  }

  async then(resolve: (result: { data: any; error: any }) => void): Promise<any> {
    try {
      const query = this.buildQuery();
      const result = await this.pool.query(query);
      const response = { data: result.rows, error: null };
      return resolve(response);
    } catch (error) {
      const response = { data: null, error };
      return resolve(response);
    }
  }
}

export class PostgreSQLAdapter implements DatabaseAdapter {
  private pool: Pool;
  private auth: PostgreSQLAuth;

  constructor(config: DatabaseConfig) {
    if (!config.postgresql) {
      throw new Error('PostgreSQL configuration is required');
    }

    this.pool = new Pool({
      host: config.postgresql.host,
      port: config.postgresql.port,
      database: config.postgresql.database,
      user: config.postgresql.username,
      password: config.postgresql.password,
      ssl: config.postgresql.ssl,
    });

    this.auth = new PostgreSQLAuth();
  }

  async signUp(email: string, password: string, options?: any): Promise<AuthResponse> {
    try {
      // In a real implementation, you'd hash the password and store it securely
      const hashedPassword = password; // Use bcrypt or similar in production
      
      const query = `
        INSERT INTO users (id, email, password_hash, user_metadata, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, now(), now())
        RETURNING id, email, user_metadata
      `;
      
      const result = await this.pool.query(query, [
        email,
        hashedPassword,
        JSON.stringify(options?.data || {})
      ]);

      if (result.rows.length > 0) {
        const user: User = {
          id: result.rows[0].id,
          email: result.rows[0].email,
          user_metadata: result.rows[0].user_metadata,
        };

        const session: Session = {
          user,
          access_token: `mock_token_${user.id}`,
        };

        this.auth.setSession(session);

        return { user, session, error: null };
      }

      return { user: null, session: null, error: { message: 'Failed to create user' } };
    } catch (error: any) {
      return { user: null, session: null, error };
    }
  }

  async signInWithPassword(email: string, password: string): Promise<AuthResponse> {
    try {
      const query = `
        SELECT id, email, password_hash, user_metadata
        FROM users
        WHERE email = $1
      `;
      
      const result = await this.pool.query(query, [email]);

      if (result.rows.length > 0) {
        const userData = result.rows[0];
        
        // In production, use bcrypt to verify the password
        if (userData.password_hash === password) {
          const user: User = {
            id: userData.id,
            email: userData.email,
            user_metadata: userData.user_metadata,
          };

          const session: Session = {
            user,
            access_token: `mock_token_${user.id}`,
          };

          this.auth.setSession(session);

          return { user, session, error: null };
        }
      }

      return { user: null, session: null, error: { message: 'Invalid credentials' } };
    } catch (error: any) {
      return { user: null, session: null, error };
    }
  }

  async signOut(): Promise<void> {
    this.auth.clearSession();
  }

  async getSession(): Promise<{ session: Session | null }> {
    return { session: this.auth.getSession() };
  }

  onAuthStateChange(callback: (event: string, session: Session | null) => void): { subscription: { unsubscribe: () => void } } {
    return { subscription: this.auth.addListener(callback) };
  }

  from(table: string): DatabaseQuery {
    return new PostgreSQLQuery(this.pool, table);
  }

  get functions() {
    return {
      invoke: async (functionName: string, options: { body: any }) => {
        // For PostgreSQL, implement custom function calls
        // This is a placeholder implementation
        try {
          // Example: Call a stored procedure or custom function
          const result = await this.pool.query(`SELECT ${functionName}($1)`, [JSON.stringify(options.body)]);
          return { data: result.rows[0], error: null };
        } catch (error) {
          return { data: null, error };
        }
      },
    };
  }
}