import { ArrowLeft, HeartPulse, SearchX } from 'lucide-react';
import { Link } from 'wouter';

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-background px-5 py-6 text-foreground">
      <header className="flex items-center justify-between border-b border-border pb-5">
        <Link href="/" className="flex items-center gap-2 font-display text-sm font-bold" data-testid="link-not-found-home"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><HeartPulse size={17} /></span>Rakt Kavach</Link>
        <span className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">National blood grid</span>
      </header>
      <main className="mx-auto flex max-w-lg flex-col items-center justify-center py-24 text-center">
        <span className="grid size-16 place-items-center rounded-2xl bg-secondary text-primary"><SearchX size={30} /></span>
        <p className="mt-7 font-mono text-xs uppercase tracking-[.18em] text-primary">Route not found</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">This handoff has no destination.</h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">The page may have moved, or the link may be incomplete. Return to the gateway and choose a live network console.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground" data-testid="link-return-gateway"><ArrowLeft size={15} />Return to gateway</Link>
      </main>
    </div>
  );
}
