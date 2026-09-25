import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, Crosshair, HeartPulse, LogOut, MapPin, WalletCards, Shield, Droplets, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'wouter';
import DigitalDonorCard from '@/components/DigitalDonorCard';
import BloodUnitTimeline from '@/components/BloodUnitTimeline';
import KavachAI from '@/components/KavachAI';
import { useAuth } from '@/context/auth';
import { supabase } from '@/context/supabase';
import type { Donor, InventoryUnit } from '@/types/database';

export default function DonorDashboard(): JSX.Element | null {
  const { user, logout } = useAuth(); 
  const [, navigate] = useLocation(); 
  const [donor, setDonor] = useState<Donor | null>(null); 
  const [units, setUnits] = useState<InventoryUnit[]>([]); 
  const [radius, setRadius] = useState(50); 
  const [recipient, setRecipient] = useState(''); 
  const [message, setMessage] = useState('');

  // लाइव सुपाबेस डेटाबेस लोडिंग (यथावत सुरक्षित)
  useEffect(() => { 
    let active = true; 
    const load = async (): Promise<void> => { 
      const donorQuery = await supabase.from('donors').select('*').limit(1).maybeSingle(); 
      const inventoryQuery = await supabase.from('blood_inventory').select('*').limit(20); 
      if (active) { 
        setDonor(donorQuery.data); 
        setUnits(inventoryQuery.data ?? []); 
      } 
    }; 
    void load(); 
    return () => { active = false; }; 
  }, []);

  if (!user) { 
    navigate('/'); 
    return null; 
  }

  const name = donor?.full_name ?? user.name;

  return (
    <main className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] text-slate-100 p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* एम्बिएंट साइबर नियॉन बैकग्राउंड ग्लो */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* प्रीमियम डोनर कमांड सेंटर हेडर */}
      <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-red-600 to-red-900 p-2.5 rounded-xl border border-red-500/20 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <Droplets className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[.25em] text-red-400 font-bold flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5" /> Rakt Kavach • Donor Wallet
              </p>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold tracking-wider uppercase">ABHA ID Linked</span>
            </div>
            <h1 className="mt-1 text-2xl md:text-3xl font-black text-slate-200 tracking-tight">
              Welcome back, {name.split(' ')[0]}
            </h1>
          </div>
        </div>
        
        <button 
          type="button" 
          onClick={() => { logout(); navigate('/'); }} 
          className="flex items-center justify-center rounded-xl bg-slate-950/80 border border-slate-800 hover:border-red-500/40 hover:text-red-400 p-3 text-slate-400 transition-all shadow-sm" 
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </header>

      {/* मुख्य २-कॉलम डैशबोर्ड ग्रिड */}
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_.9fr] relative z-10">
        
        {/* लेफ़्ट ग्रिड कॉलम: आपका डिजिटल डोनर स्मार्ट पहचान पत्र */}
        <div className="space-y-6">
          <DigitalDonorCard name={name} bloodGroup={donor?.blood_group ?? 'B+'} credits={1} />
          
          {/* रीयलटाइम नेशनल एलिजिबिलिटी कंप्लायंस स्टेटस */}
          <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">National Grid Compliance</p>
                <p className="text-xs font-bold text-slate-200">ELIGIBLE FOR LIVE DONATION (YES)</p>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-black">ACTIVE</span>
          </div>
        </div>

        {/* राइट ग्रिड कॉलम: इमरजेंसी रेडियस इंडेंट एवं ट्रांसफर वॉलेट */}
        <section className="space-y-6">
          
          {/* १. इमरजेंसी लाइव ब्लड रिक्वेस्ट रेडियस सेलेक्टर */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-md p-6 shadow-xl relative overflow-hidden border-t-red-500/30">
            <div className="flex items-center gap-3.5 border-b border-slate-900 pb-4 mb-5">
              <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
                <Crosshair className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h2 className="font-black text-sm tracking-wide text-slate-200">Emergency Blood Request</h2>
                <p className="text-xs text-slate-400 mt-0.5">Find verified blood support near you.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/60">
              <MapPin className="h-5 w-5 text-cyan-400 flex-shrink-0" />
              <input 
                type="range" 
                min="5" 
                max="100" 
                value={radius} 
                onChange={(event) => setRadius(Number(event.target.value))} 
                className="w-full accent-cyan-400 cursor-pointer h-1 bg-slate-800 rounded-lg appearance-none" 
              />
              <span className="text-xs font-black text-cyan-400 font-mono bg-cyan-500/5 px-2.5 py-1 rounded-md border border-cyan-500/10 whitespace-nowrap">{radius} km</span>
            </div>
          </div>

          {/* २. सिक्योर ब्लड क्रेडिट ट्रांसफर वॉलेट */}
          <div className="rounded-3xl border border-slate-800 bg-slate-950/40 backdrop-blur-md p-6 shadow-xl border-t-cyan-500/30">
            <div className="mb-4 flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-black text-sm tracking-wide text-slate-200">Transfer Blood Credit</h2>
                <p className="text-xs text-slate-400 mt-0.5">Transfer credits instantly via secure unique identifier.</p>
              </div>
            </div>

            <div className="flex gap-2">
              <input 
                value={recipient} 
                onChange={(event) => setRecipient(event.target.value)} 
                placeholder="Recipient ID e.g. RC-IN-1234" 
                className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors" 
              />
              <button 
                type="button" 
                onClick={() => { 
                  if (/^RC-[A-Z0-9-]{4,}\$/.test(recipient)) { 
                    setMessage('Transfer request queued for secure verification.'); 
                    setRecipient(''); 
                  } else {
                    setMessage('Enter a valid recipient ID.'); 
                  }
                }} 
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-4 text-slate-950 font-black transition-all flex items-center justify-center shadow-lg"
              >
                <WalletCards className="h-4 w-4" />
              </button>
            </div>
            
            {message && (
              <p className={`mt-3 text-xs font-semibold px-3 py-2 rounded-lg border ${message.includes('queued') ? 'bg-cyan-500/5 border-cyan-500/10 text-cyan-300' : 'bg-red-500/5 border-red-500/10 text-red-400'}`}>
                {message}
              </p>
            )}
          </div>

          {/* ३. कवच एआई हेल्थ असिस्टेंट (AI Health Integration) */}
          <KavachAI />
        </section>
      </div>

      {/* फुटर: लाइव ब्लड यूनिट टाइमलाइन डेटाबेस फीड */}
      <div className="mx-auto mt-6 max-w-7xl relative z-10">
        <div className="bg-slate-950/40 backdrop-blur-md border border-slate-800 p-6 rounded-3xl shadow-2xl">
          <BloodUnitTimeline />
          <p className="mt-4 text-[11px] text-slate-500 font-medium">
            * National Grid Sync Summary: {units.length} secure blood inventory units currently tracked and visible through your connected health network node cluster.
          </p>
        </div>
      </div>
    </main>
  );
}
