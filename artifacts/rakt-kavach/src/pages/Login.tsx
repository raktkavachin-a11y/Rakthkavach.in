import { ArrowRight, Globe2, HeartPulse, Languages, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth, type AuthRole, INSTITUTIONAL_ROLES } from '@/context/auth';
import { languageLabels, supportedLanguages, useI18n } from '@/context/i18n';

type LoginTier = 'donor' | 'institution';

const roleLabels: Record<AuthRole, string> = {
  donor: 'Donor', hospital: 'Hospital', laboratory: 'Laboratory', block_officer: 'Block Officer',
  district_authority: 'District Authority', state_command: 'State Command', national_board: 'National Board',
  who_command: 'WHO Command', system_admin: 'System Admin',
};

export default function Login(): JSX.Element {
  const { language, setLanguage } = useI18n();
  const { requestDonorOtp, verifyDonorOtp, loginInstitution, requestPasswordReset } = useAuth();
  const [, navigate] = useLocation();
  const [tier, setTier] = useState<LoginTier>('donor');
  const [role, setRole] = useState<AuthRole>('hospital');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [licenseId, setLicenseId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const institutionRoles = INSTITUTIONAL_ROLES;

  const sendOtp = async (): Promise<void> => {
    setError(''); setMessage('');
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    try { await requestDonorOtp(`+91${phone}`); setOtpSent(true); setMessage('A real OTP was sent to your mobile number.'); }
    catch { setError('Unable to send OTP. Please try again.'); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setError(''); setMessage('');
    try {
      if (tier === 'donor') {
        if (!otpSent) { await sendOtp(); return; }
        if (!/^[6-9]\d{9}$/.test(phone) || !/^\d{6}$/.test(otp)) { setError('Incorrect OTP'); return; }
        if (!name.trim()) { setError('Enter your name to continue.'); return; }
        await verifyDonorOtp(`+91${phone}`, otp, name.trim()); navigate('/donor'); return;
      }
      if (!licenseId.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        setError('Enter a valid Govt Registration ID, domain email, and password (minimum 8 characters).'); return;
      }
      await loginInstitution({ role, licenseId: licenseId.trim(), email: email.trim().toLowerCase(), password });
      navigate(role === 'hospital' || role === 'laboratory' ? '/hospital' : '/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid Credentials');
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setError(''); setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter the registered institution email.'); return; }
    try { await requestPasswordReset(email.trim().toLowerCase()); setResetOpen(false); setMessage('If the account exists, a password reset link has been sent.'); }
    catch { setError('Unable to start password reset. Please try again.'); }
  };

  return <main className="min-h-screen bg-[#030712] p-4 text-white md:p-8"><div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 lg:grid-cols-2"><section><p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[.25em] text-cyan-300"><HeartPulse className="h-5 w-5" /> Rakt Kavach</p><h1 className="mt-6 text-5xl font-black leading-tight">One verified network.<br /><span className="text-cyan-300">Every life connected.</span></h1><p className="mt-5 max-w-lg text-slate-400">Secure access to India’s unified blood grid, donor wallet, emergency response, and command intelligence.</p><div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300"><span className="rounded-full border border-white/10 px-3 py-2"><ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-300" /> Real OTP protected</span><span className="rounded-full border border-white/10 px-3 py-2"><Globe2 className="mr-2 inline h-4 w-4 text-cyan-300" /> Live network</span></div></section><form onSubmit={submit} className="rounded-3xl border border-cyan-300/20 bg-white/[.05] p-6 shadow-2xl shadow-cyan-950/30"><div className="mb-6 flex items-center justify-between"><div><h2 className="text-2xl font-bold">Secure entry</h2><p className="text-sm text-slate-400">Use the credential tier assigned to your account.</p></div><Languages className="h-5 w-5 text-cyan-300" /></div><div className="mb-5 grid grid-cols-2 gap-2"><button type="button" onClick={() => { setTier('donor'); setError(''); }} className={`rounded-xl px-3 py-3 text-sm font-bold ${tier === 'donor' ? 'bg-cyan-300 text-slate-950' : 'bg-white/10'}`}>Donor access</button><button type="button" onClick={() => { setTier('institution'); setError(''); }} className={`rounded-xl px-3 py-3 text-sm font-bold ${tier === 'institution' ? 'bg-cyan-300 text-slate-950' : 'bg-white/10'}`}>Institution / Admin</button></div>{tier === 'donor' ? <><label className="block text-sm text-slate-300">Full name<input value={name} onChange={e => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" autoComplete="name" /></label><label className="mt-4 block text-sm text-slate-300"><Smartphone className="mr-1 inline h-4 w-4" /> Mobile number<input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" placeholder="9876543210" autoComplete="tel" /></label>{otpSent && <label className="mt-4 block text-sm text-slate-300"><LockKeyhole className="mr-1 inline h-4 w-4" /> OTP<input value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" maxLength={6} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3 tracking-[.4em]" autoComplete="one-time-code" /></label>}</> : <><label className="block text-sm text-slate-300">Institution / command role<select value={role} onChange={e => setRole(e.target.value as AuthRole)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#081426] px-3 py-3 text-white">{institutionRoles.map(item => <option key={item} value={item}>{roleLabels[item]}</option>)}</select></label><label className="mt-4 block text-sm text-slate-300">Govt / Hospital Registration ID<input value={licenseId} onChange={e => setLicenseId(e.target.value)} placeholder="ROBH / NABH / HFR code" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" autoComplete="organization" /></label><label className="mt-4 block text-sm text-slate-300">Registered institution email<input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" autoComplete="username" /></label><label className="mt-4 block text-sm text-slate-300"><LockKeyhole className="mr-1 inline h-4 w-4" /> Password<input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" autoComplete="current-password" /></label><button type="button" onClick={() => setResetOpen(true)} className="mt-3 text-sm text-cyan-300 underline">Forgot Password?</button></>}{error && <p role="alert" className="mt-3 text-sm text-rose-300">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-emerald-300">{message}</p>}<button type="submit" className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-300 py-3 font-bold text-slate-950">{tier === 'donor' && !otpSent ? 'Send OTP' : 'Verify & enter'} <ArrowRight className="h-4 w-4" /></button><div className="mt-5 flex justify-center gap-2 text-xs">{supportedLanguages.map(item => <button type="button" key={item.code} onClick={() => setLanguage(item.code)} className={language === item.code ? 'font-bold text-cyan-300' : 'text-slate-500'}>{languageLabels[item.code]}</button>)}</div></form></div>{resetOpen && <div role="dialog" aria-modal="true" className="fixed inset-0 grid place-items-center bg-black/70 p-4"><form onSubmit={resetPassword} className="w-full max-w-md rounded-2xl border border-cyan-300/20 bg-[#081426] p-6"><h2 className="text-xl font-bold">Reset institution password</h2><p className="mt-2 text-sm text-slate-400">We’ll email a secure reset link to the registered address.</p><input value={email} onChange={e => setEmail(e.target.value)} type="email" required placeholder="institution@example.gov.in" className="mt-5 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-3" /><div className="mt-5 flex gap-3"><button type="button" onClick={() => setResetOpen(false)} className="flex-1 rounded-xl border border-white/10 py-3">Cancel</button><button type="submit" className="flex-1 rounded-xl bg-cyan-300 py-3 font-bold text-slate-950">Send reset link</button></div></form></div>}</main>;
}
