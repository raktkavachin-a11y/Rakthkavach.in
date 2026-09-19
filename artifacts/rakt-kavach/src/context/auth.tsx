import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

export type AuthRole =
  | 'donor'
  | 'hospital'
  | 'laboratory'
  | 'block_officer'
  | 'district_authority'
  | 'state_command'
  | 'national_board'
  | 'who_command'
  | 'system_admin';

export interface AuthUser {
  id: string;
  name: string;
  role: AuthRole;
  region: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loginAs: (role: AuthRole, name: string, region?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginAs = (role: AuthRole, name: string, region = 'India'): void => {
    setUser({
      id: `${role}-${Date.now()}`,
      name,
      role,
      region,
    });
  };

  const logout = (): void => {
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, loginAs, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
