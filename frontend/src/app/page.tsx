export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-100 p-6 font-sans">
      <main className="flex max-w-xl flex-col items-center text-center space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-10 shadow-2xl backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Frontend Foundation Active
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          PROOFLEARN
        </h1>
        
        <p className="text-sm font-medium uppercase tracking-wider text-emerald-400">
          Task 01 — Project Foundation
        </p>

        <p className="text-base text-zinc-400 italic">
          &ldquo;Don&apos;t just get the answer. Prove you learned it.&rdquo;
        </p>

        <div className="pt-4 border-t border-zinc-800 w-full text-xs text-zinc-500">
          Next.js + TypeScript + Tailwind CSS
        </div>
      </main>
    </div>
  );
}
