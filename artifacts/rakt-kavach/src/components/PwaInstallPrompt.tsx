import { useEffect, useState } from 'react';
import { supabase } from '@/context/supabase';
import { useAuth } from '@/context/auth';
import type { Donor } from '@/types/database';

export default function PwaInstallPrompt(): JSX.Element | null {
  const { user } = useAuth(); const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null); const [visible, setVisible] = useState(false); const [ios, setIos] = useState(false);
  useEffect(() => { const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone); setIos(isIos); const handler = (event: Event): void => { event.preventDefault(); setInstallEvent(event as BeforeInstallPromptEvent); }; window.addEventListener('beforeinstallprompt', handler); return () => window.removeEventListener('beforeinstallprompt', handler); }, []);
  useEffect(() => { if ((installEvent || ios) && !sessionStorage.getItem('rk-pwa-dismissed')) setVisible(true); }, [installEvent, ios]);
  if (!visible || !user) return null;
  const install = async (): Promise<void> => { if (!installEvent) return; await installEvent.prompt(); setInstallEvent(null); setVisible(false); };
  return <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-300/30 bg-[#081426] p-4 text-white shadow-2xl"><div className="mx-auto flex max-w-3xl items-center justify-between gap-4"><div><h2 className="font-bold">Install Rakt Kavach App</h2>{ios ? <p className="text-sm text-slate-300">Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> in Safari.</p> : <p className="text-sm text-slate-300">Keep your blood network one tap away.</p>}</div><div className="flex gap-2"><button onClick={() => { sessionStorage.setItem('rk-pwa-dismissed', '1'); setVisible(false); }} className="rounded-lg border border-white/20 px-3 py-2 text-sm">Not now</button>{!ios && <button onClick={() => void install()} className="rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">Install</button>}</div></div></aside>;
}
interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>; }
