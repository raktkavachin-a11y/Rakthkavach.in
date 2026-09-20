import { type PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';
import { supabase } from '@/context/supabase';

export type AuthRole = 'donor' | 'hospital' | 'laboratory' | 'block_officer' | 'district_authority' | 'state_command' | 'national_board' | 'who_command' | 'system_admin';
export const INSTITUTIONAL_ROLES: AuthRole[] = ['hospital', 'laboratory', 'block_officer', 'district_authority', 'state_command', 'national_board', 'who_command', 'system_admin'];
const COMMAND_ROLES = new Set<AuthRole>(INSTITUTIONAL_ROLES);

export interface AuthUser { id: string; name: string; role: AuthRole; region: string; authMethod: 'otp' | 'institution'; licenseId?: string; }
interface InstitutionCredentials { role: AuthRole; licenseId: string; email: string; password: string; }
interface AuthContextValue {
  user: AuthUser | null;
  requestDonorOtp: (phone: string) => Promise<void>;
  verifyDonorOtp: (phone: string, otp: string, name: string) => Promise<void>;
  loginInstitution: (credentials: InstitutionCredentials) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  canAccess: (role: AuthRole) => boolean;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const requestDonorOtp = async (phone: string): Promise<void> => { const { error } = await supabase.auth.signInWithOtp({ phone, options: { shouldCreateUser: true } }); if (error) throw new Error(error.message); };
  const verifyDonorOtp = async (phone: string, otp: string, name: string): Promise<void> => {
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    if (error || !data.user) throw new Error('Incorrect OTP');
    const metadataRole = data.user.user_metadata?.role as AuthRole | undefined;
    if (metadataRole && metadataRole !== 'donor') throw new Error('Unauthorized Role Access');
    setUser({ id: data.user.id, name, role: 'donor', region: 'India', authMethod: 'otp' });
  };
  const loginInstitution = async ({ role, licenseId, email, password }: InstitutionCredentials): Promise<void> => {
    if (!COMMAND_ROLES.has(role)) throw new Error('Unauthorized Role Access');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error('Invalid Credentials');
    const metadata = data.user.user_metadata as { role?: AuthRole; license_id?: string; full_name?: string; region?: string };
    if (!COMMAND_ROLES.has(metadata.role as AuthRole) || metadata.role !== role || metadata.license_id !== licenseId) {
      await supabase.auth.signOut(); throw new Error('Unauthorized Role Access');
    }
    setUser({ id: data.user.id, name: metadata.full_name ?? email, role, region: metadata.region ?? 'India', authMethod: 'institution', licenseId });
  };
  const requestPasswordReset = async (email: string): Promise<void> => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) throw new Error(error.message); };
  const canAccess = (role: AuthRole): boolean => Boolean(user && user.role === role && (user.authMethod === 'institution' || role === 'donor'));
  const logout = async (): Promise<void> => { await supabase.auth.signOut(); setUser(null); };
  const value = useMemo(() => ({ user, requestDonorOtp, verifyDonorOtp, loginInstitution, requestPasswordReset, canAccess, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(): AuthContextValue { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; }
