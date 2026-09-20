import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Activity, AlertTriangle, Building2, Globe2, Truck } from 'lucide-react';
import { useAuth, type AuthRole } from '@/context/auth';
import { useI18n } from '@/context/i18n';
import { supabase } from '@/context/supabase';

type Counter = { label: string; value: number; icon: typeof Building2 };
const seedFallback = { donors: 0, institutions: 0, bloodWallets: 0 };
const sosRoles = new Set<AuthRole>(['who_command', 'national_board', 'state_command']);

export default function AdminDashboard(): JSX.Element {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const [sosActive, setSosActive] = useState(false);
  const [metrics, setMetrics] = useState(seedFallback);

  useEffect(() => {
    let active = true;
    const loadMetrics = async (): Promise<void> => {
      const [donors, institutions, wallets] = await Promise.all([
        supabase.from('donors').select('*', { count: 'exact', head: true }),
        supabase.from('institutions').select('*', { count: 'exact', head: true }),
        supabase.from('blood_wallets').select('*', { count: 'exact', head: true }),
      ]);
      if (!active) return;
      setMetrics({
        donors: donors.count ?? seedFallback.donors,
        institutions: institutions.count ?? seedFallback.institutions,
        bloodWallets: wallets.count ?? seedFallback.bloodWallets,
      });
    };
    void loadMetrics();
    return () => { active = false; };
  }, []);

  if (!user) { navigate('/'); return null; }
  const canTriggerSos = sosRoles.has(user.role);
  const cards: Counter[] = [
    { value: metrics.donors, label: 'Verified donors', icon: Building2 },
    { value: metrics.institutions, label: 'Verified institutions', icon: Globe2 },
    { value: metrics.bloodWallets, label: 'Blood wallets', icon: Activity },
    { value: 0, label: 'Logistics routes', icon: Truck },
  ];

  return <main className={`min-h-screen bg-[#030712] p-4 text-white md:p-8 ${sosActive ? 'animate-pulse' : ''}`}>
    <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between">
      <div><p className="text-xs uppercase tracking-[.2em] text-rose-300">{t('whoCommand')} · command center</p><h1 className="text-3xl font-black">Administrative command center</h1></div>
      <button onClick={() => { void logout(); navigate('/'); }} className="rounded-lg border border-white/10 px-3 py-2 text-xs">{t('logout')}</button>
    </header>
    <section className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl border border-white/10 bg-slate-950/70 p-5"><Icon className="mb-4 text-cyan-300" /><p className="text-3xl font-black">{value}</p><p className="text-sm text-slate-400">{label}</p></article>)}
    </section>
    {canTriggerSos && <section className="mx-auto mt-6 max-w-7xl rounded-2xl border border-rose-400/30 bg-rose-950/20 p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="font-bold">SOS response</h2><p className="text-sm text-slate-400">Available only to WHO, National, and State command views.</p></div><button onClick={() => setSosActive((value) => !value)} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold">{sosActive ? 'Deactivate SOS' : 'Trigger SOS'}</button></div></section>}
  </main>;
}
