import { LogOut, Moon, Sun } from "lucide-react";
import { AppSettings } from "../types";

export function Header({ settings, onToggleDark, userEmail, offlineMode, onSignOut }: { settings: AppSettings; onToggleDark: () => void; userEmail?: string; offlineMode?: boolean; onSignOut?: () => void }) {
  return (
    <header className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <p className="label">Olá, {settings.studentName || "estudante"}</p>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">{settings.appName}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200 sm:inline-flex">{offlineMode ? "Modo offline" : userEmail}</span>
        {settings.examMode && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-200">Modo Prova Próxima</span>}
        <button className="btn" onClick={onToggleDark} title="Alternar modo escuro">
          {settings.darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        {onSignOut && <button className="btn" onClick={onSignOut} title="Sair"><LogOut size={17} /></button>}
      </div>
    </header>
  );
}
