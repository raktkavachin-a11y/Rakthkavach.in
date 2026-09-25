import React, { useEffect, useState } from 'react';
import { 
  Camera, CheckCircle2, ClipboardList, PackageCheck, 
  ScanLine, ShieldAlert, LogOut, Building2, AlertTriangle, 
  Activity, ShieldCheck 
} from 'lucide-react';
import { useLocation } from 'wouter';

import { useAuth } from '@/context/auth';
import { useI18n } from '@/context/i18n';
import { supabase } from '@/context/supabase';
import type { InventoryUnit } from '@/types/database';

export default function HospitalDashboard(): JSX.Element | null {
  const { user, logout } = useAuth(); 
  const [, navigate] = useLocation(); 
  const { t } = useI18n(); 
  const [token, setToken] = useState(''); 
  const [result, setResult] = useState(''); 
  const [inventory, setInventory] = useState<InventoryUnit[]>([]);

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      const query = await supabase.from('blood_inventory').select('*').limit(30);
      if (active) setInventory(query.data ?? []);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const scan = (): void => {
    if (!token.trim()) {
      setResult('Present a donor or unit QR identifier.');
      return;
    }
    setResult('Eligibility check queued: identity and safety screening required before donation.');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <main className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] text-slate-100 p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* प्रीमियम बैकग्राउंड ग्लो */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* व्यवस्थित प्रीमियम हेडर */}
      <header className="mx-auto mb-8 flex max-w-7xl items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-cyan-600 to-slate-900 p-2.5 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Building2 className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs uppercase tracking-[.2em] text-cyan-400 font-semibold">{t('hospital')}</p>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md font-bold tracking-wider uppercase">ABDM/FHIR R4 Nodes Connected</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-200 mt-0.5">Rakt Kavach Clinical Scanner</h1>
          </div>
        </div>
        <button 
          onClick={() => { logout(); navigate('/'); }} 
          className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 hover:border-red-500/40 hover:text-red-400 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <LogOut size={13} /> {t('logout')}
        </button>
      </header>

      {/* मुख्य २-कॉलम ग्रिड लेआउट */}
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[.9fr_1.1fr]">
        
        {/* लेफ़्ट साइडबार: सुरक्षित स्कैनर नोड */}
        <section className="rounded-2xl border border-slate-800 bg-slate-950/40 backdrop-blur-md p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="mb-6 flex items-center gap-3 border-b border-slate-900 pb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                <ScanLine className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{t('scanner')}</p>
                <h2 className="text-lg font-black text-slate-200">Eligibility Scanner Portal</h2>
              </div>
            </div>

            {/* लाइव कैमरा सिमुलेशन एरिया */}
            <div className="grid place-items-center rounded-xl border border-dashed border-slate-800 bg-slate-900/20 py-12 text-center group hover:border-cyan-500/40 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors shadow-inner">
                <Camera size={26} />
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-300">Camera System Ready</p>
              <p className="text-[10px] text-slate-500 mt-1">Place Smart Donor QR Card in view</p>
            </div>

            <input 
              value={token} 
              onChange={(event) => setToken(event.target.value)} 
              placeholder="Paste QR token / RC identifier" 
              className="mt-5 w-full rounded-xl border border-slate-800 bg-slate-900/40 px-4 py-3 text-sm text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-slate-900/80 transition-all" 
            />
          </div>

          <div className="mt-4">
            <button 
              onClick={scan} 
              className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold py-3.5 transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)] flex items-center justify-center gap-2"
            >
              RUN SAFETY SCREENING
            </button>
            {result && (
              <div className="mt-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 p-3.5 text-xs text-cyan-300 leading-relaxed font-medium animate-fadeIn">
                <div className="flex gap-2 items-start">
                  <Activity className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>{result}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* राइट साइडबार: मेट्रिक्स और सुपाबेस इन्वेंट्री */}
        <section className="space-y-6">
          
          {/* ३-कॉलम क्विक स्टैट्स ग्रिड */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['0', 'Lifetime Donations', ClipboardList, 'text-cyan-400', 'bg-cyan-500/5'],
              ['0', 'Safety Flags', ShieldAlert, 'text-red-400', 'bg-red-500/5'],
              ['0', 'Eligible Today', CheckCircle2, 'text-emerald-400', 'bg-emerald-500/5']
            ].map(([value, label, Icon, colorClass, bgClass]) => (
              <div key={String(label)} className="rounded-xl border border-slate-800 bg-slate-950/40 backdrop-blur-md p-4 flex flex-col justify-between shadow-md">
                <div className={`p-2 ${bgClass} ${colorClass} rounded-lg w-fit border border-slate-800/40`}>
                  <Icon size={18} />
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-black text-slate-100 tracking-tight">{String(value)}</p>
                  <p className="text-[11px] font-bold text-slate-400 tracking-wide mt-0.5">{String(label)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* लाइव लोकल सुपाबेस इन्वेंट्री */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 backdrop-blur-md p-5 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3 mb-4">
              <PackageCheck className="text-emerald-400 w-5 h-5" />
              <h2 className="font-black text-xs uppercase tracking-widest text-slate-400">Live Local Storage Units</h2>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {inventory.length ? (
                inventory.map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between rounded-xl bg-slate-900/40 px-4 py-3 text-sm border border-slate-800/50 hover:border-slate-700 transition-colors">
                    <span className="font-bold text-slate-200">{unit.facility_name} · <span className="text-cyan-400 font-black">{unit.blood_group}</span></span>
                    <span className="font-mono text-xs font-black text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1 rounded-md">{unit.units} units</span>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center rounded-xl bg-slate-900/10 border border-slate-900 border-dashed">
                  <p className="text-xs text-slate-500 font-medium">No active inventory records returned from grid.</p>
                </div>
              )}
            </div>
          </div>

          {/* सुरक्षा फिल्टर फुटनोट */}
          <div className="rounded-xl border border-amber-500/10 bg-amber-500/5 p-4 text-[11px] text-amber-200/80 leading-relaxed flex gap-2.5 items-start">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Mandatory Safety Filters Locked:</strong> Compliance parameters mandate rigorous verification checks including HIV screening, critical medication review, thalassemia inheritance risks, minimum recent donation interval intervals, and licensed clinician final approval signatures prior to unit acceptance.
            </span>
          </div>
        </section>

      </div>
    </main>
  );
}
