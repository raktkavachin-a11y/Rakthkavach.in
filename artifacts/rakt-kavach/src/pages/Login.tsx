import React, { useState } from 'react';

// भाषाओं के अनुवाद (Translations)
const translations: Record<string, any> = {
  en: {
    title: "One verified network. Every life connected.",
    subtitle: "Secure multi-tier access gateway into India's unified blood network.",
    secureEntry: "Secure Entry",
    selectRole: "Select Your Role",
    phone: "Mobile Number",
    sendOtp: "Send OTP",
    verifyOtp: "Verify OTP",
    enterOtp: "Enter 6-Digit OTP",
    donor: "Donor",
    admin: "Institution / Admin",
    who: "WHO (World Health Organization)",
    completeProfile: "Complete Your Profile",
    fullName: "Full Name",
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    email: "Email Address",
    bloodGroup: "Blood Group",
    state: "State",
    district: "District",
    saveProfile: "Save & Enter Dashboard"
  },
  hi: {
    title: "एक सत्यापित नेटवर्क। हर जीवन जुड़ा हुआ।",
    subtitle: "भारत के एकीकृत रक्त नेटवर्क में सुरक्षित बहु-स्तरीय पहुंच गेटवे।",
    secureEntry: "सुरक्षित प्रवेश",
    selectRole: "अपना रोल चुनें",
    phone: "मोबाइल नंबर",
    sendOtp: "ओटीपी भेजें",
    verifyOtp: "ओटीपी सत्यापित करें",
    enterOtp: "6-अंकों का ओटीपी दर्ज करें",
    donor: "रक्तदाता (Donor)",
    admin: "संस्था / एडमिन",
    who: "डब्ल्यूएचओ (WHO)",
    completeProfile: "अपनी प्रोफाइल पूरी करें",
    fullName: "पूरा नाम",
    fatherName: "पिता का नाम",
    motherName: "माता का नाम",
    email: "ईमेल आईडी",
    bloodGroup: "रक्त समूह (Blood Group)",
    state: "राज्य",
    district: "जिला",
    saveProfile: "प्रोफाइल सुरक्षित करें और आगे बढ़ें"
  }
};

export default function Login() {
  const [lang, setLang] = useState('en');
  const [role, setRole] = useState('donor');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Profile Form

  // प्रोफाइल स्टेट्स
  const [profile, setProfile] = useState({
    name: '', fatherName: '', motherName: '', email: '', bloodGroup: '', state: '', district: ''
  });

  const t = translations[lang] || translations['en'];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      if (role === 'donor') {
        setStep(3); // डोनर को प्रोफाइल भरने का समय दें
      } else {
        alert(`Redirecting to ${role} dashboard...`);
      }
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile Saved! Redirecting to Donor Dashboard...");
  };

  return (
    <div style={{ background: '#0a0d14', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* शीर्ष भाषा चयनकर्ता */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ padding: '8px', background: '#161b26', color: '#fff', border: '1px solid #303642', borderRadius: '6px' }}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <h2 style={{ color: '#ff2f54', fontSize: '14px', trackingLetter: '2px' }}>❤️ RAKT KAVACH GRID</h2>
        <h1 style={{ fontSize: '32px', margin: '10px 0' }}>{t.title}</h1>
        <p style={{ color: '#8b949e', maxWidth: '500px', margin: '0 auto' }}>{t.subtitle}</p>
      </div>

      <div style={{ maxWidth: '450px', margin: '0 auto', background: '#161b26', padding: '30px', borderRadius: '12px', border: '1px solid #303642' }}>
        <h3 style={{ fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #303642', paddingBottom: '10px' }}>{t.secureEntry}</h3>

        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>{t.selectRole}</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '12px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px' }}>
                <option value="donor">{t.donor}</option>
                <option value="admin">{t.admin}</option>
                <option value="who">{t.who}</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>{t.phone}</label>
              <input type="tel" placeholder="98765XXXXX" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.sendOtp} →</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#c9d1d9' }}>{t.enterOtp}</label>
              <input type="text" placeholder="XXXXXX" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '5px', fontSize: '18px' }} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#238636', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.verifyOtp}</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleProfileSubmit}>
            <h4 style={{ color: '#ff2f54', marginBottom: '15px' }}>{t.completeProfile}</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              <input type="text" placeholder={t.fullName} required style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
              <input type="text" placeholder={t.fatherName} style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.fatherName} onChange={e => setProfile({...profile, fatherName: e.target.value})} />
              <input type="text" placeholder={t.motherName} style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.motherName} onChange={e => setProfile({...profile, motherName: e.target.value})} />
              <input type="email" placeholder={t.email} style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
              
              <select required style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px' }} value={profile.bloodGroup} onChange={e => setProfile({...profile, bloodGroup: e.target.value})}>
                <option value="">-- {t.bloodGroup} --</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>

              <input type="text" placeholder={t.state} required style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.state} onChange={e => setProfile({...profile, state: e.target.value})} />
              <input type="text" placeholder={t.district} required style={{ width: '100%', padding: '10px', background: '#0d1117', color: '#fff', border: '1px solid #303642', borderRadius: '6px', boxSizing: 'border-box' }} value={profile.district} onChange={e => setProfile({...profile, district: e.target.value})} />
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', marginTop: '15px', background: '#ff2f54', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>{t.saveProfile}</button>
          </form>
        )}
      </div>
    </div>
  );
}
