import { type PropsWithChildren, createContext, useContext, useMemo } from 'react';

import { getSupabaseClient } from '@/context/supabase';

interface SupabaseContextValue {
  client: ReturnType<typeof getSupabaseClient>;
}

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: PropsWithChildren): JSX.Element {
  const client = useMemo(() => getSupabaseClient(), []);

  const value = useMemo<SupabaseContextValue>(() => ({ client }), [client]);

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
}

export function useSupabase(): ReturnType<typeof getSupabaseClient> {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }

  return context.client;
}
