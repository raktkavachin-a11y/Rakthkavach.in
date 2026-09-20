import { Award, BadgeCheck, Gift, HeartPulse, QrCode, Send, ShieldAlert, WalletCards } from 'lucide-react';

type DigitalDonorCardProps = { name: string; bloodGroup?: string; credits?: number; photoUrl?: string };

export default function DigitalDonorCard({ name, bloodGroup = 'B+', credits = 1, photoUrl }: DigitalDonorCardProps): JSX.Element {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  return <section aria-label="Digital donor card" className="space-y-4">
    <div className="relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#102b54] via-[#08172d] to-[#09101f] p-5 shadow-2xl shadow-cyan-950/30">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-4"><div className="flex items-center gap-3">
        {photoUrl ? <img src={photoUrl} alt={`${name}'s profile`} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-cyan-300/40" /> : <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-300/15 text-lg font-bold text-cyan-200 ring-2 ring-cyan-300/30">{initials}</div>}
        <div><p className="text-xs uppercase tracking-[.2em] text-cyan-200/70">Digital donor identity</p><h2 className="text-xl font-bold text-white">{name}</h2><p className="mt-1 flex items-center gap-1 text-xs text-emerald-300"><BadgeCheck className="h-4 w-4" /> Verified donor</p></div>
      </div><div className="rounded-xl bg-white p-2"><QrCode className="h-16 w-16 text-slate-900" aria-label="Smart QR code" /></div></div>
      <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/10 pt-4"><div><p className="text-xs uppercase tracking-wider text-slate-400">Blood group</p><p className="mt-1 text-3xl font-black text-rose-300">{bloodGroup}</p></div><div><p className="text-xs uppercase tracking-wider text-slate-400">Blood credits</p><p className="mt-1 text-3xl font-black text-cyan-200">{credits.toFixed(2)} <span className="text-sm font-medium">Credits</span></p></div></div>
      <p className="relative mt-4 text-[11px] text-slate-400">Smart QR • Tap to verify donor identity and eligibility</p>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[[Send, 'Transfer Blood Credit'], [ShieldAlert, 'Emergency Request'], [Award, 'Certificates'], [Gift, 'Rewards']].map(([Icon, label]) => <button type="button" key={label as string} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.04] p-3 text-center text-xs text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10"><Icon className="h-5 w-5 text-cyan-300" /><span>{label as string}</span></button>)}</div>
  </section>;
}
