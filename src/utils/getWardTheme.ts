import { PatientStatus } from "../types";

export type WardTheme = {
  label: string;
  description: string;
  backgroundClass: string;
  borderClass: string;
  textClass: string;
  badgeClass: string;
  iconName: "alert" | "siren" | "triangle" | "pulse" | "star" | "ghost" | "moon" | "clock" | "clipboard";
};

export function getWardTheme(status: PatientStatus): WardTheme {
  const themes: Record<PatientStatus, WardTheme> = {
    red: {
      label: "Ala Vermelha",
      description: "Dificuldade grave. Precisa de teoria completa antes de avançar.",
      backgroundClass: "bg-red-50 dark:bg-red-950/60",
      borderClass: "border-red-500",
      textClass: "text-red-900 dark:text-red-100",
      badgeClass: "border-red-500 bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-100",
      iconName: "alert",
    },
    orange: {
      label: "Ala Laranja",
      description: "Urgente. Existe base, mas as lacunas ainda atrapalham.",
      backgroundClass: "bg-orange-50 dark:bg-orange-950/60",
      borderClass: "border-orange-500",
      textClass: "text-orange-900 dark:text-orange-100",
      badgeClass: "border-orange-500 bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-100",
      iconName: "siren",
    },
    yellow: {
      label: "Ala Amarela",
      description: "Atenção. Foque nos erros e nos pontos específicos.",
      backgroundClass: "bg-amber-50 dark:bg-amber-950/60",
      borderClass: "border-amber-400",
      textClass: "text-amber-950 dark:text-amber-100",
      badgeClass: "border-amber-400 bg-amber-100 text-amber-950 dark:bg-amber-950 dark:text-amber-100",
      iconName: "triangle",
    },
    green: {
      label: "Ala Verde",
      description: "Estável. Agora é confirmar se o domínio se mantém.",
      backgroundClass: "bg-emerald-50 dark:bg-emerald-950/60",
      borderClass: "border-emerald-500",
      textClass: "text-emerald-900 dark:text-emerald-100",
      badgeClass: "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100",
      iconName: "pulse",
    },
    discharged: {
      label: "Alta",
      description: "Recuperado. Volta só para revisão espaçada.",
      backgroundClass: "bg-sky-50 dark:bg-sky-950/60",
      borderClass: "border-sky-500",
      textClass: "text-sky-900 dark:text-sky-100",
      badgeClass: "border-sky-500 bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-100",
      iconName: "star",
    },
    ghost: {
      label: "Fantasmas",
      description: "Ficaram tempo demais sem revisão. Precisam voltar à triagem.",
      backgroundClass: "bg-violet-50 dark:bg-violet-950/60",
      borderClass: "border-violet-500",
      textClass: "text-violet-900 dark:text-violet-100",
      badgeClass: "border-violet-500 bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-100",
      iconName: "ghost",
    },
    sleeping: {
      label: "Dormindo",
      description: "Em repouso até o próximo retorno.",
      backgroundClass: "bg-slate-50 dark:bg-slate-900",
      borderClass: "border-slate-400",
      textClass: "text-slate-700 dark:text-slate-100",
      badgeClass: "border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100",
      iconName: "moon",
    },
    review_due: {
      label: "Revisão pendente",
      description: "O retorno chegou. Hora de revisar.",
      backgroundClass: "bg-fuchsia-50 dark:bg-fuchsia-950/60",
      borderClass: "border-fuchsia-500",
      textClass: "text-fuchsia-900 dark:text-fuchsia-100",
      badgeClass: "border-fuchsia-500 bg-fuchsia-100 text-fuchsia-900 dark:bg-fuchsia-950 dark:text-fuchsia-100",
      iconName: "clock",
    },
    not_triaged: {
      label: "Não triado",
      description: "Paciente novo aguardando a primeira triagem.",
      backgroundClass: "bg-slate-50 dark:bg-slate-900",
      borderClass: "border-slate-300",
      textClass: "text-slate-700 dark:text-slate-100",
      badgeClass: "border-slate-300 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100",
      iconName: "clipboard",
    },
  };

  return themes[status];
}
