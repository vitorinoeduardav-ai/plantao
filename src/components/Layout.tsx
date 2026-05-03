import { ReactNode } from "react";
import { AppSettings } from "../types";
import { Header } from "./Header";
import { PageKey, Sidebar } from "./Sidebar";

export function Layout({ children, current, settings, onNavigate, onToggleDark, userEmail, offlineMode, onSignOut }: { children: ReactNode; current: PageKey; settings: AppSettings; onNavigate: (page: PageKey) => void; onToggleDark: () => void; userEmail?: string; offlineMode?: boolean; onSignOut?: () => void }) {
  return (
    <div className="min-h-screen bg-[#f7fbf9] text-slate-800 dark:bg-slate-950 dark:text-slate-100 lg:flex">
      <Sidebar current={current} onNavigate={onNavigate} appName={settings.appName} />
      <main className="w-full px-4 py-5 sm:px-6 lg:px-8">
        <Header settings={settings} onToggleDark={onToggleDark} userEmail={userEmail} offlineMode={offlineMode} onSignOut={onSignOut} />
        {children}
      </main>
    </div>
  );
}
