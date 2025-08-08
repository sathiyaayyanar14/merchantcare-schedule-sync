import { DatabaseAdapter } from './types';
import { databaseConfig } from './config';
import { SupabaseAdapter } from './adapters/supabase';
import { PostgreSQLAdapter } from './adapters/postgresql';

let databaseInstance: DatabaseAdapter | null = null;

export const createDatabaseAdapter = (): DatabaseAdapter => {
  if (databaseInstance) {
    return databaseInstance;
  }

  switch (databaseConfig.provider) {
    case 'supabase':
      databaseInstance = new SupabaseAdapter(databaseConfig);
      break;
    case 'postgresql':
      databaseInstance = new PostgreSQLAdapter(databaseConfig);
      break;
    default:
      throw new Error(`Unsupported database provider: ${databaseConfig.provider}`);
  }

  return databaseInstance;
};

export const getDatabase = (): DatabaseAdapter => {
  if (!databaseInstance) {
    databaseInstance = createDatabaseAdapter();
  }
  return databaseInstance;
};