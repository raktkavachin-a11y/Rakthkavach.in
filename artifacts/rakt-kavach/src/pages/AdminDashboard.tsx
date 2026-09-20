import { LogOut, ShieldCheck } from 'lucide-react';
import { useLocation } from 'wouter';
import NationalGrid, { type CommandScope } from '@/components/NationalGrid';
import { useAuth } from '@/context/auth';

export default function AdminDashboard(): JSX.Element {
  const { user, logout, canAccess } = useAuth(); const [, navigate] = useLocation();
  if (!user || !canAccess(user.role) || user.role === 'donor' || user.authMethod !== 'institution') { navigate('/'); return null; }
  const scope = user.role as CommandScope;
  return <main className="min-h-screen bg-[#030712] p-4 text-white md:p-8"><header className="mx-auto mb-8 flex max-w-7xl items-center justify-between"><div><p className="flex items-center gap-2 text-xs uppercase tracking-[.2em] text-cyan-300"><ShieldCheck className="h-4 w-4" /> Institutional command access</p><h1 className="mt-2 text-2xl font-bold">{user.name}</h1></div><button onClick={() => { void logout(); navigate('/'); }} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs"><LogOut size={14} /> Logout</button></header><NationalGrid scope={scope} /></main>;
}
