import { useEffect, useState } from 'react';

export default function PwaInstallPrompt(): JSX.Element | null {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);
  const [standalone, setStandalone] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const isIosDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isStandaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    setIos(isIosDevice);
    setStandalone(isStandaloneMode);
    if (!isStandaloneMode && !sessionStorage.getItem('rk-pwa-dismissed')) setVisible(true);

    const handler = (event: Event): void => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      if (!sessionStorage.getItem('rk-pwa-dismissed')) setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible || standalone) return null;

  const install = async (): Promise<void> => {
    if (!installEvent) {
      setShowInstructions(true);
      return;
    }
    await installEvent.prompt();
    setInstallEvent(null);
    setVisible(false);
  };

  const actionLabel = ios || !installEvent ? 'Add to Home Screen' : 'Download to Home Screen';
  return (
    <aside className="fixed inset-x-0 bottom-0 z-50 border-t border-cyan-300/30 bg-[#081426] p-4 text-white shadow-2xl" aria-live="polite">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <div>
          <h2 className="font-bold">Install Rakt Kavach</h2>
          <p className="text-sm text-slate-300">
            {ios ? 'Tap Share, then Add to Home Screen in Safari.' : 'Keep the blood network one tap away.'}
          </p>
          {showInstructions && !ios && !installEvent && (
            <p className="mt-1 text-xs text-cyan-200">Open your browser menu and choose “Add to Home Screen” or “Install app”.</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => { sessionStorage.setItem('rk-pwa-dismissed', '1'); setVisible(false); }} className="rounded-lg border border-white/20 px-3 py-2 text-sm">Not now</button>
          <button type="button" onClick={() => void install()} className="rounded-lg bg-cyan-300 px-3 py-2 text-sm font-bold text-slate-950">{actionLabel}</button>
        </div>
      </div>
    </aside>
  );
}
interface BeforeInstallPromptEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>; }
