import { type PropsWithChildren, createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { supabase } from '@/context/supabase';

export type AuthRole =
  | 'donor' | 'hospital' | 'laboratory' | 'block_officer' | 'district_authority'
  | 'state_command' | 'national_board' | 'who_command' | 'system_admin';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: AuthRole;
  region: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const roles = new Set<AuthRole>(['donor', 'hospital', 'laboratory', 'block_officer', 'district_authority', 'state_command', 'national_board', 'who_command', 'system_admin']);

function toAuthUser(authUser: User): AuthUser {
  const metadata = authUser.user_metadata ?? {};
  const role = roles.has(metadata.role as AuthRole) ? metadata.role as AuthRole : 'donor';
  return { id: authUser.id, name: metadata.name || authUser.phone || 'Verified user', phone: authUser.phone || '', role, region: metadata.region || 'India' };
}

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ? toAuthUser(data.session.user) : null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ? toAuthUser(nextSession.user) : null);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user, session, loading,
    sendOtp: async (phone) => {
      const { error } = await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: true } });
      if (error) throw error;
    },
    verifyOtp: async (phone, token) => {
      const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
      if (error) throw error;
    },
    logout: async () => { await supabase.auth.signOut(); },
  }), [loading, session, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
