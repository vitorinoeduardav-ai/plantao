import { ReactNode, useState } from "react";
import { Activity, BarChart3, BookOpen, Building2, CalendarDays, ChevronDown, ChevronRight, HeartPulse, Home, Pill, Settings, Stethoscope, UsersRound, LayoutGrid } from "lucide-react";

export type PageKey =
  | "dashboard"
  | "treatment-plan"
  | "reception"
  | "triage"
  | "wards"
  | "study-shift"
  | "pharmacy"
  | "question-bank"
  | "question-editor"
  | "import-questions"
  | "patient-record"
  | "reviews"
  | "statistics"
  | "settings"
  | "registration-center"
  | "patients-admin"
  | "medications-admin";

const studyNav = [
  { key: "dashboard", label: "Painel Geral", icon: Home },
  { key: "treatment-plan", label: "Plano de Tratamento", icon: CalendarDays },
  { key: "study-shift", label: "Plantão", icon: HeartPulse },
  { key: "reception", label: "Recepção", icon: UsersRound },
  { key: "wards", label: "Alas", icon: Building2 },
  { key: "reviews", label: "Revisões", icon: Stethoscope },
  { key: "pharmacy", label: "Farmácia", icon: Pill },
  { key: "statistics", label: "Estatísticas", icon: BarChart3 },
] as const;

const adminNav = [
  { key: "registration-center", label: "Central de Cadastro", icon: LayoutGrid },
  { key: "question-bank", label: "Banco de Questões", icon: BookOpen },
  { key: "medications-admin", label: "Medicamentos", icon: Pill },
  { key: "patients-admin", label: "Pacientes", icon: UsersRound },
  { key: "settings", label: "Configurações", icon: Settings },
] as const;

export function Sidebar({ current, onNavigate, appName }: { current: PageKey; onNavigate: (page: PageKey) => void; appName: string }) {
  const [adminOpen, setAdminOpen] = useState(false);
  const adminCurrent = adminNav.some((item) => item.key === current) || current === "question-editor" || current === "import-questions";

  return (
    <aside className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-4 py-4">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-white"><Activity size={24} /></span>
        <div>
          <p className="text-sm font-black text-slate-900 dark:text-white">{appName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">plantão de estudos</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto px-3 pb-3 lg:grid lg:overflow-visible">
        <p className="hidden px-3 pt-2 text-xs font-black uppercase tracking-[0.08em] text-slate-400 lg:block">Estudo</p>
        {studyNav.map(({ key, label, icon: Icon }) => (
          <NavButton key={key} active={current === key} label={label} icon={<Icon size={17} />} onClick={() => onNavigate(key)} />
        ))}
        <button
          className={`hidden items-center justify-between rounded-md px-3 py-2 text-xs font-black uppercase tracking-[0.08em] lg:flex ${adminCurrent ? "text-teal-700 dark:text-teal-300" : "text-slate-400"}`}
          onClick={() => setAdminOpen((open) => !open)}
        >
          Administração {adminOpen || adminCurrent ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
        </button>
        <button className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" onClick={() => onNavigate("registration-center")}>
          <LayoutGrid size={17} /> Cadastros
        </button>
        {(adminOpen || adminCurrent) && adminNav.map(({ key, label, icon: Icon }) => (
          <NavButton key={key} active={current === key} label={label} icon={<Icon size={17} />} onClick={() => onNavigate(key)} />
        ))}
      </nav>
    </aside>
  );
}

function NavButton({ active, label, icon, onClick }: { active: boolean; label: string; icon: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition ${
        active ? "bg-teal-700 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
