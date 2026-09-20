import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const configuredAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

// Keep the static build usable when environment variables have not been added yet.
// Requests made with these placeholders fail safely instead of preventing the app from rendering.
const FALLBACK_URL = 'http://localhost:54321';
const FALLBACK_ANON_KEY = 'local-development-anon-key';

function getSupabaseConfig(): { url: string; anonKey: string } {
  const url = configuredUrl || FALLBACK_URL;
  const anonKey = configuredAnonKey || FALLBACK_ANON_KEY;

  if (!configuredUrl || !configuredAnonKey) {
    console.warn(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Replit or Vercel environment variables.',
    );
  }

  try {
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('The Supabase URL must use HTTP or HTTPS.');
    }
  } catch {
    console.warn('Invalid VITE_SUPABASE_URL; using the local development fallback.');
    return { url: FALLBACK_URL, anonKey };
  }

  return { url, anonKey };
}

let client: SupabaseClient<Database> | undefined;

export function getSupabaseClient(): SupabaseClient<Database> {
  if (client) return client;

  const { url, anonKey } = getSupabaseConfig();
  client = createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-app-name': 'rakt-kavach',
      },
    },
  });

  return client;
}

// Keep the named export for existing consumers while constructing the client lazily.
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, property, receiver) {
    return Reflect.get(getSupabaseClient(), property, receiver);
  },
});
