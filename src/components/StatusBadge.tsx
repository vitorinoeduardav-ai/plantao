import { PatientStatus } from "../types";
import { getWardTheme } from "../utils/getWardTheme";
import { WardIcon } from "./WardIcon";

export const statusLabels: Record<PatientStatus, string> = {
  not_triaged: "Não triado",
  red: "Vermelha",
  orange: "Laranja",
  yellow: "Amarela",
  green: "Verde",
  discharged: "Alta",
  ghost: "Fantasma",
  sleeping: "Dormindo",
  review_due: "Revisão pendente",
};

export const statusStyles: Record<PatientStatus, string> = {
  not_triaged: getWardTheme("not_triaged").badgeClass,
  red: getWardTheme("red").badgeClass,
  orange: getWardTheme("orange").badgeClass,
  yellow: getWardTheme("yellow").badgeClass,
  green: getWardTheme("green").badgeClass,
  discharged: getWardTheme("discharged").badgeClass,
  ghost: getWardTheme("ghost").badgeClass,
  sleeping: getWardTheme("sleeping").badgeClass,
  review_due: getWardTheme("review_due").badgeClass,
};

export function StatusBadge({ status }: { status: PatientStatus }) {
  const theme = getWardTheme(status);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs font-bold ${theme.badgeClass}`}>
      <WardIcon iconName={theme.iconName} size={13} />
      {theme.label}
    </span>
  );
}
