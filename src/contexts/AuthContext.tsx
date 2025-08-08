
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getDatabase } from '@/lib/database';
import type { User, Session } from '@/lib/database';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const database = getDatabase();
    
    // Set up auth state listener FIRST
    const { subscription } = database.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    database.getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName?: string) => {
    const database = getDatabase();
    
    // Use the Lovable project URL for redirect
    const redirectUrl = window.location.origin;
    
    const { error } = await database.signUp(email, password, {
      emailRedirectTo: redirectUrl,
      data: {
        full_name: fullName,
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const database = getDatabase();
    
    const { error } = await database.signInWithPassword(email, password);
    return { error };
  };

  const signOut = async () => {
    const database = getDatabase();
    await database.signOut();
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
