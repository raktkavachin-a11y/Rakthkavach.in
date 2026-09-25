import React, { useState } from 'react';
import { 
  Shield, Activity, Droplets, MapPin, CreditCard, 
  User, CheckCircle2, AlertTriangle, Smartphone, 
  QrCode, TrendingUp, Thermometer, ShieldAlert 
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Legend } from 'recharts';

// मॉक डेटा - पीएम-अभिमान और राष्ट्रीय रक्त ग्रिड मानकों के अनुसार
const stockData = [
  { name: 'AB+', count: 202, label: 'In Stock' },
  { name: 'O-', count: 159, label: 'In Stock' },
  { name: 'Platelets', count: 36, label: 'Low Stock' },
  { name: 'Plasma', count: 288, label: 'In Stock' },
];

const demandSupplyData = [
  { month: 'Jan', Supply: 120, Demand: 140 },
  { month: 'Mar', Supply: 210, Demand: 190 },
  { month: 'May', Supply: 180, Demand: 220 },
  { month: 'Jul', Supply: 290, Demand: 240 },
  { month: 'Sep', Supply: 340, Demand: 310 },
  { month: 'Nov', Supply: 400, Demand: 380 },
];

export default function RaktKavachDashboard() {
  const [selectedLang, setSelectedLang] = useState('English (Eng)');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    'English (Eng)', 'తెలుగు (Telugu)', 'हिन्दी (Hindi)', 'বাংলা (Bangla)',
    'தமிழ் (Tamil)', 'मराठी (Marathi)', 'ગુજરાતી (Gujarati)', 'ಕನ್ನಡ (Kannada)'
  ];

  return (
    <div className="min-h-screen bg-[#020617] bg-[radial-gradient(circle_at_center,#0f172a_0%,#020617_100%)] text-slate-100 p-6 font-sans relative overflow-hidden">
      
      {/* ग्लोइंग नियॉन इफेक्ट्स (Background Decor) */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* टॉप नेविगेशन और हेडर */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 p-2 rounded-lg shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-cyan-400">
              RAKT KAVACH (रक्त कवच)
            </h1>
            <p className="text-xs text-slate-400 tracking-widest uppercase">National Command Center • Live Status</p>
          </div>
        </div>

        {/* भाषा चयनकर्ता बटन (Language Selector) */}
        <div className="relative">
          <button 
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 bg-slate-900/80 border border-slate-700 px-4 py-2 rounded-lg text-sm text-cyan-400 hover:border-cyan-500 transition-all shadow-sm"
          >
            <span>🌐 {selectedLang}</span>
          </button>
          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl p-2 grid grid-cols-1 gap-1 z-50 shadow-2xl backdrop-blur-xl">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => { setSelectedLang(lang); setShowLangMenu(false); }}
                  className={`text-left px-3 py-1.5 rounded-lg text-xs transition-colors ${selectedLang === lang ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* मुख्य डैशबोर्ड ग्रिड लेआउट */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* लेफ़्ट कॉलम: मोबाइल लॉग-इन & आभाम (ABDM Integration) इंटरफ़ेस */}
        <div className="space-y-6">
          <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-medium">ABDM Integrated</span>
              <span className="text-xs text-slate-500">Security: Maximum</span>
            </div>
            
            <div className="text-center my-6">
              <div className="inline-block relative">
                <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(239,68,68,0.2)]">
                  <Droplets className="w-8 h-8 text-red-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-lg font-bold mt-4 tracking-wide">Donor Registration / Login</h3>
              <p className="text-xs text-slate-400 mt-1">Automated Real-Identity Access via UIDAI & ABHA</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Enter Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm text-slate-500">+91</span>
                  <input type="text" placeholder="Enter Registered Number" className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1.5">Enter 6-Digit OTP</label>
                <div className="grid grid-cols-6 gap-2">
                  {[...Array(6)].map((_, i) => (
                    <input key={i} type="text" maxLength={1} className="w-full h-10 bg-slate-900 border border-slate-700 rounded-lg text-center font-bold text-sm text-cyan-400 focus:outline-none focus:border-cyan-500" />
                  ))}
                </div>
                <div className="text-right mt-1.5">
                  <span className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-400">Resend OTP in 2:00</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4" /> VERIFY & ACCESS
              </button>
            </div>
          </div>
        </div>

        {/* मिडिल कॉलम: नेशनल मैप एनालिटिक्स & ब्लड वॉलेट बैलेंस */}
        <div className="space-y-6 xl:col-span-2">
          
          {/* डिजिटल ब्लड वॉलेट और क्विक मेट्रिक्स */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Digital Blood Wallet</p>
                <h4 className="text-2xl font-black text-cyan-400 mt-0.5">2.00 <span className="text-xs font-normal text-slate-400">Credits</span></h4>
              </div>
            </div>

            <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Geo-Radius Alert</p>
                <h4 className="text-sm font-bold text-slate-200 mt-1">50-100 km Radius Active</h4>
              </div>
            </div>

            <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-xl text-green-400 border border-green-500/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">National Eligibility</p>
                <h4 className="text-sm font-bold text-green-400 mt-1">ELIGIBLE (YES)</h4>
              </div>
            </div>
          </div>

          {/* नक्शा, स्टॉक और डेटा चार्ट ग्रिड */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* स्टॉक स्टेटस मॉड्यूल */}
            <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 p-5 rounded-2xl">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> LIVE BLOOD STOCK STATUS
              </h3>
              <div className="space-y-3.5">
                {stockData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-sm text-cyan-400">{item.name}</span>
                      <span className="text-xs text-slate-300 font-medium">{item.count} Units Avail.</span>
                    </div>
