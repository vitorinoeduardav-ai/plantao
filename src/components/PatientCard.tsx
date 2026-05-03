import { ClipboardList, FileText, Pill } from "lucide-react";
import { Patient } from "../types";
import { formatDateTime } from "../utils/dateUtils";
import { getWardTheme } from "../utils/getWardTheme";
import { CountdownTimer } from "./CountdownTimer";
import { HeartMeter } from "./HeartMeter";
import { PatientAvatar } from "./PatientAvatar";
import { StatusBadge } from "./StatusBadge";

export function PatientCard({
  patient,
  onTriage,
  onRecord,
  onMedication,
  onEdit,
  onDelete,
}: {
  patient: Patient;
  onTriage: () => void;
  onRecord: () => void;
  onMedication: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const displayStatus =
    patient.status !== "not_triaged" && patient.status !== "ghost" && patient.nextReviewAt
      ? new Date(patient.nextReviewAt).getTime() <= Date.now()
        ? "review_due"
        : "sleeping"
      : patient.status;
  const theme = getWardTheme(displayStatus);
  const primary =
    displayStatus === "not_triaged"
      ? { label: "Fazer triagem", icon: ClipboardList, action: onTriage }
      : displayStatus === "review_due" || displayStatus === "ghost"
        ? { label: "Revisar agora", icon: ClipboardList, action: onTriage }
        : patient.status === "red" || patient.status === "orange"
          ? { label: "Estudar medicamento", icon: Pill, action: onMedication }
          : { label: "Ver prontuário", icon: FileText, action: onRecord };
  const PrimaryIcon = primary.icon;

  return (
    <article className={`flex h-full flex-col gap-3 rounded-lg border-2 p-4 shadow-sm ${theme.backgroundClass} ${theme.borderClass}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PatientAvatar patient={patient} />
          <div className="min-w-0">
            <h3 className="truncate font-black text-slate-900 dark:text-white">{patient.name}</h3>
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">{patient.subject}</p>
          </div>
        </div>
        <StatusBadge status={displayStatus} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-md bg-white/75 p-2 dark:bg-slate-900/70">
          <p className="label">Cura</p>
          <p className="font-black">{patient.cureIndex}%</p>
        </div>
        <div className="rounded-md bg-white/75 p-2 dark:bg-slate-900/70">
          <p className="label">Corações</p>
          <HeartMeter hearts={patient.hearts} />
        </div>
        <div className="rounded-md bg-white/75 p-2 dark:bg-slate-900/70">
          <p className="label">Tentativas</p>
          <p className="font-black">{patient.attempts}</p>
        </div>
        <div className="rounded-md bg-white/75 p-2 dark:bg-slate-900/70">
          <p className="label">Retorno</p>
          <CountdownTimer nextReviewAt={patient.nextReviewAt} />
        </div>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Próximo retorno: {formatDateTime(patient.nextReviewAt)}</p>
      <div className="mt-auto grid gap-2 sm:grid-cols-3">
        <button className="btn btn-primary" onClick={primary.action}><PrimaryIcon size={16} /> {primary.label}</button>
        <button className="btn" onClick={onRecord}><FileText size={16} /> Prontuário</button>
        <button className="btn" onClick={onMedication}><Pill size={16} /> Teoria</button>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex gap-2 border-t border-slate-100 pt-2 dark:border-slate-800">
          {onEdit && <button className="btn flex-1" onClick={onEdit}>Editar</button>}
          {onDelete && <button className="btn flex-1 border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={onDelete}>Excluir</button>}
        </div>
      )}
    </article>
  );
}
