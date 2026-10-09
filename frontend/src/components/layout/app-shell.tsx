import React from "react";
import { Header } from "./header";
import { Footer } from "./footer";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-300 relative eye-comfort-pattern">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
