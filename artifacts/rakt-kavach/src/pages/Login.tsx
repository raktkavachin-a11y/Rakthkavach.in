import { ArrowRight, Globe2, HeartPulse, Languages, LockKeyhole, ShieldCheck, Smartphone, Eye, EyeOff, Loader2 } from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth, type AuthRole, INSTITUTIONAL_ROLES } from '@/context/auth';
import { languageLabels, supportedLanguages, useI18n } from '@/context/i18n';

type LoginTier = 'donor' | 'institution';

const roleLabels: Record<AuthRole, string> = {
  donor: 'Donor', 
  hospital: 'Hospital', 
  laboratory: 'Laboratory', 
  block_officer: 'Block Officer',
  district_authority: 'District Authority', 
  state_command: 'State Command', 
  national_board: 'National Board',
  who_command: 'WHO Command', 
  system_admin: 'System Admin',
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const institutionRoles = INSTITUTIONAL_ROLES;

  const sendOtp = async (): Promise<void> => {
    setError(''); setMessage('');
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setLoading(true);
    try { 
      await requestDonorOtp(`+91${phone}`); 
      setOtpSent(true); 
      setMessage('A real OTP was sent to your mobile number.'); 
    }
    catch { setError('Unable to send OTP. Please try again.'); }
    finally { setLoading(false); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setError(''); setMessage('');
    setLoading(true);
    try {
      if (tier === 'donor') {
        if (!otpSent) { await sendOtp(); return; }
        if (!/^[6-9]\d{9}$/.test(phone) \vert{}\vert{} !/^\d{6}$/.test(otp)) { setError('Incorrect OTP'); return; }
        if (!name.trim()) { setError('Enter your name to continue.'); return; }
        await verifyDonorOtp(`+91${phone}`, otp, name.trim()); 
        navigate('/donor'); 
        return;
      }
      if (!licenseId.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
        setError('Enter a valid Govt Registration ID, domain email, and password (minimum 8 characters).'); 
        return;
      }
      await loginInstitution({ role, licenseId: licenseId.trim(), email: email.trim().toLowerCase(), password });
      navigate(role === 'hospital' || role === 'laboratory' ? '/hospital' : '/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); setError(''); setMessage('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter the registered institution email.'); return; }
    try { 
      await requestPasswordReset(email.trim().toLowerCase()); 
      setResetOpen(false); 
      setMessage('If the account exists, a password reset link has been sent.'); 
    }
    catch { setError('Unable to start password reset. Please try again.'); }
  };

  return (
    <main className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] p-4 text-slate-100 md:p-8 flex items-center justify-center relative overflow-hidden font-sans">
      
      {/* एम्बिएंट नियॉन ग्लो इफ़ेक्ट्स */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-2 relative z-10 w-full">
        
        {/* लेफ़्ट सेक्शन: ब्रांडिंग और नेटवर्क स्टेटस */}
        <section className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-bold text-cyan-400">
            <HeartPulse className="h-4 w-4 text-red-500 animate-pulse" />
            <span>RAKT KAVACH GRID</span>
          </div>
          <h1 className="mt-5 text-3xl md:text-5xl font-black leading-tight tracking-tight text-white">
            One verified network.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Every life connected.</span>
          </h1>
          <p className="mt-4 max-w-lg text-sm text-slate-400 leading-relaxed">
            Secure multi-tier access gateway into India's unified blood network management system.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-bold">
            <span className="rounded-xl bg-slate-950/80 border border-slate-800/80 px-3.5 py-2 flex items-center text-slate-300">
              <ShieldCheck className="mr-2 h-4 w-4 text-emerald-400" /> Real OTP Protected
            </span>
            <span className="rounded-xl bg-slate-950/80 border border-slate-800/80 px-3.5 py-2 flex items-center text-slate-300">
              <Globe2 className="mr-2 h-4 w-4 text-cyan-400" /> Live Grid Active
            </span>
          </div>
        </section>

        {/* राइट सेक्शन: डार्क नियॉन फॉर्म */}
        <form onSubmit={submit} className="rounded-3xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative border-t-cyan-500/40">
          
          {/* हेडर और डार्क थीम भाषा सेलेक्टर */}
          <div className="mb-6 flex items-center justify-between border-b border-slate-900 pb-4">
            <div>
              <h2 className="text-xl font-black text-white tracking-wide">Secure Entry</h2>
              <p className="text-xs text-slate-400 mt-0.5">Select your access level</p>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200">
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)} 
                className="bg-slate-900 text-slate-200 font-bold focus:outline-none cursor-pointer border-none"
              >
                {supportedLanguages.map(item => (
                  <option key={item.code} value={item.code} className="bg-slate-900 text-slate-100">
                    {languageLabels[item.code]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* २-टीयर मुख्य स्विच बटन्स (सफ़ेद ड्रॉपडाउन हटा दिया गया) */}
          <div className="mb-6 grid grid-cols-2 gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
            <button 
              type="button" 
              onClick={() => { setTier('donor'); setError(''); setMessage(''); }} 
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${tier === 'donor' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Donor Access
            </button>
            <button 
              type="button" 
              onClick={() => { setTier('institution'); setError(''); setMessage(''); }} 
              className={`rounded-xl py-2.5 text-xs font-bold transition-all ${tier === 'institution' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Institution / Admin
            </button>
          </div>

          {/* एरर व मैसेज अलर्ट्स */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs font-semibold mb-4">
              {error}
            </div>
          )}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3 rounded-xl text-xs font-semibold mb-4">
              {message}
            </div>
          )}

          {/* इनपुट्स */}
          <div className="space-y-4">
            {tier === 'donor' ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter name as per ID" 
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input 
                      type="tel"
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="10-digit mobile number" 
                      maxLength={10}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600" 
                    />
                  </div>
                </div>

                {otpSent && (
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Verification OTP</label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                      <input 
                        type="text"
                        value={otp} 
                        onChange={e => setOtp(e.target.value)} 
                        placeholder="6-digit OTP code" 
                        maxLength={6}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono tracking-widest placeholder:text-slate-600" 
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Authority Role</label>
                  <select 
                    value={role} 
                    onChange={e => setRole(e.target.value as AuthRole)} 
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                  >
                    {institutionRoles.map(r => (
                      <option key={r} value={r} className="bg-slate-900 text-white">
                        {roleLabels[r]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">License / Reg ID</label>
                  <input 
                    value={licenseId} 
                    onChange={e => setLicenseId(e.target.value)} 
                    placeholder="Enter Org ID" 
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">Official Email</label>
                  <input 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="official@domain.gov.in" 
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Password</label>
                    <button 
                      type="button" 
                      onClick={() => setResetOpen(true)} 
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'}
                      value={password} 
                      onChange={e => setPassword(e.target.value)} 
                      placeholder="••••••••" 
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-4 pr-10 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 py-3.5 text-sm font-bold text-slate-950 uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {tier === 'donor' ? (otpSent ? 'Verify & Access Grid' : 'Send OTP') : 'Authenticate Portal'}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* पासवर्ड रीसेट मोडल */}
      {resetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white">Reset Institution Password</h3>
            <p className="mt-1 text-xs text-slate-400">Enter your registered domain email to receive reset instructions.</p>
            
            <form onSubmit={resetPassword} className="mt-4 space-y-4">
              <input 
                type="email"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="registered@domain.com" 
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500" 
                required
              />
              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setResetOpen(false)} 
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
