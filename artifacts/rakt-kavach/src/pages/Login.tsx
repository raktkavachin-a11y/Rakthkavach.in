import { ArrowRight, Globe2, HeartPulse, Languages, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';
import { useLocation } from 'wouter';

import { languageLabels, supportedLanguages, useI18n } from '@/context/i18n';
import { useAuth } from '@/context/auth';

interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>; }

declare global { interface Window { deferredInstallPrompt?: BeforeInstallPromptEvent; } }

export default function Login(): JSX.Element {
  const { t, language, setLanguage } = useI18n();
  const { user, loading, sendOtp, verifyOtp } = useAuth();
  const [, navigate] = useLocation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [installable, setInstallable] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate(user.role === 'donor' ? '/donor' : user.role === 'hospital' || user.role === 'laboratory' ? '/hospital' : '/admin');
  }, [navigate, user]);
  useEffect(() => {
    const handler = (event: Event) => { event.preventDefault(); window.deferredInstallPrompt = event as BeforeInstallPromptEvent; setInstallable(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => { if (!window.deferredInstallPrompt) return; await window.deferredInstallPrompt.prompt(); await window.deferredInstallPrompt.userChoice; window.deferredInstallPrompt = undefined; setInstallable(false); };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`;
      if (!/^\+91[6-9]\d{9}$/.test(normalized)) throw new Error('Enter a valid Indian mobile number.');
      if (!sent) { await sendOtp(normalized); setPhone(normalized); setSent(true); }
      else { if (!/^\d{6}$/.test(otp)) throw new Error('Enter the six-digit OTP sent to your phone.'); await verifyOtp(normalized, otp); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Authentication failed.'); }
    finally { setBusy(false); }
  };

  return <main className="min-h-screen overflow-hidden bg-[#030712] text-white"><div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(0,229,255,.12),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(255,0,51,.14),transparent_30%)]" /><div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 p-6 lg:grid lg:grid-cols-[1.1fr_.9fr] lg:items-center"><section><div className="mb-8 flex items-center gap-3"><HeartPulse className="text-[#ff0033]" size={38} /><div><p className="font-black tracking-wide">RAKT KAVACH</p><p className="text-xs text-cyan-300">National Blood Grid</p></div></div><h1 className="max-w-xl text-4xl font-black leading-tight md:text-6xl">Verified blood access for every Indian life.</h1><p className="mt-5 max-w-xl text-slate-300">Phone verification is mandatory. Your profile and donor wallet unlock only after Supabase OTP verification.</p><div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3"><span><ShieldCheck className="mb-2 text-emerald-400" />Verified identity</span><span><LockKeyhole className="mb-2 text-cyan-300" />Privacy-first access</span><span><Globe2 className="mb-2 text-amber-300" />Live national grid</span></div></section><section className="rounded-3xl border border-cyan-400/20 bg-slate-950/80 p-6 shadow-2xl backdrop-blur md:p-8"><div className="mb-6 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-cyan-300">Secure entry</p><h2 className="mt-2 text-2xl font-bold">{sent ? 'Verify your OTP' : 'Enter your phone number'}</h2></div><Smartphone className="text-cyan-300" /></div><form onSubmit={submit} className="space-y-4"><label className="block text-sm text-slate-300">Mobile number<input required value={phone} disabled={sent} onChange={event => setPhone(event.target.value)} placeholder="+91 98765 43210" inputMode="tel" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-cyan-300" /></label>{sent && <label className="block text-sm text-slate-300">One-time password<input required value={otp} onChange={event => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" inputMode="numeric" autoComplete="one-time-code" className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 tracking-[.4em]" /></label>}{error && <p role="alert" className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}<button disabled={busy || loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff0033] px-4 py-3 font-bold disabled:opacity-50">{busy ? 'Processing…' : sent ? 'Verify and continue' : 'Send secure OTP'}<ArrowRight size={17} /></button></form>{sent && <button onClick={() => { setSent(false); setOtp(''); setError(''); }} className="mt-3 text-sm text-cyan-300">Use a different number</button>}{installable && <button onClick={() => void install()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/40 px-4 py-3 text-sm text-cyan-100"><Smartphone size={17} /> Install Rakt Kavach App</button>}<div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400"><span className="flex items-center gap-2"><Languages size={15} />Language</span><select value={language} onChange={event => setLanguage(event.target.value as typeof language)} className="rounded-lg bg-white/5 px-2 py-1">{supportedLanguages.map(item => <option key={item} value={item}>{languageLabels[item]}</option>)}</select></div></section></div></main>;
}
