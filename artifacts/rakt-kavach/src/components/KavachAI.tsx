import { motion } from 'framer-motion';
import { Camera, Mic, MicOff, ShieldCheck, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useI18n } from '@/context/i18n';

type SpeechRecognitionConstructor = new () => SpeechRecognition;
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
}
interface SpeechRecognitionEvent extends Event { results: { [index: number]: { [index: number]: { transcript: string } } }; }
declare global { interface Window { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor; } }

export function KavachAI(): JSX.Element {
  const { t, language } = useI18n();
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleVoice = (): void => {
    if (listening) { recognitionRef.current?.stop(); setListening(false); return; }
    const Constructor = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Constructor) { setTranscript('Voice input is not supported in this browser.'); return; }
    const recognition = new Constructor();
    recognition.lang = language === 'en' ? 'en-IN' : `${language}-IN`;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => setTranscript(event.results[0]?.[0]?.transcript ?? '');
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  useEffect(() => () => recognitionRef.current?.stop(), []);

  return <section className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-5 shadow-2xl backdrop-blur-md">
    <div className="mb-4 flex items-center justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-cyan-300">{t('healthAssistant')}</p><h2 className="mt-1 text-lg font-semibold text-white">Kavach care core</h2></div><ShieldCheck className="text-emerald-400" /></div>
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={toggleVoice} className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 text-cyan-100 transition hover:border-cyan-300/50">{listening ? <MicOff /> : <Mic />}<span className="text-sm">{t('voiceInput')}</span><span className="text-xs text-slate-400">{listening ? 'Listening…' : 'Tap to describe symptoms'}</span></button>
      <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/5 text-cyan-100 transition hover:border-cyan-300/50"><input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(event) => { const file = event.target.files?.[0]; if (file) setPreview(URL.createObjectURL(file)); }} /><Camera /><span className="text-sm">{t('aiVision')}</span><span className="text-xs text-slate-400">{preview ? 'Image attached for review' : 'Camera or upload'}</span></label>
    </div>
    {transcript && <p className="mt-3 rounded-lg bg-cyan-400/10 p-3 text-sm text-cyan-100">{transcript}</p>}
    {preview && <div className="mt-3 flex items-center gap-3 rounded-lg bg-white/5 p-3"><img src={preview} alt="First-aid preview" className="h-16 w-16 rounded object-cover" /><span className="text-xs text-slate-300">For safety, seek qualified medical care for serious bleeding, burns, or infection.</span><Upload size={16} className="ml-auto text-cyan-300" /></div>}
  </section>;
}

export default KavachAI;
