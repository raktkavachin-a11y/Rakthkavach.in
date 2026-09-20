import { LogOut, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import NationalGrid, { type CommandScope } from '@/components/NationalGrid';
import { useAuth } from '@/context/auth';

export default function AdminDashboard(): JSX.Element {
  const { user, logout } = useAuth(); const [, navigate] = useLocation();
  if (!user) { navigate('/'); return null; }
  const scope = user.role as CommandScope;
  return <main className="min-h-screen bg-[#030712] p-4 text-white md:p-8"><header className="mx-auto mb-8 flex max-w-7xl items-center justify-between"><div><p className="flex items-center gap-2 text-xs uppercase tracking-[.25em] text-cyan-300"><ShieldCheck className="h-4 w-4" /> Command operations • {user.region}</p><h1 className="mt-2 text-3xl font-black">{user.name}</h1></div><button type="button" onClick={() => { logout(); navigate('/'); }} className="rounded-xl border border-white/10 p-3 text-slate-300 hover:bg-white/10" aria-label="Sign out"><LogOut className="h-5 w-5" /></button></header><div className="mx-auto max-w-7xl"><NationalGrid scope={scope} /></div></main>;
}
