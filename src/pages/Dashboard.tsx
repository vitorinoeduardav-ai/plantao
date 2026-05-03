import { AlertTriangle, Building2, CalendarDays, ClipboardList, Moon, Settings, Sun, UsersRound } from "lucide-react";
import { ReactNode } from "react";
import { AppActions } from "../App";
import { PatientAvatar } from "../components/PatientAvatar";
import { PatientCard } from "../components/PatientCard";
import { StatusBadge } from "../components/StatusBadge";
import { WardIcon } from "../components/WardIcon";
import { AppData, PatientStatus } from "../types";
import { getTimeRemaining } from "../utils/dateUtils";
import { getReceptionQueue, ReceptionQueueItem } from "../utils/receptionQueue";
import { daysUntil, getExamStatus } from "../utils/studyPlan";
import { getWardTheme } from "../utils/getWardTheme";

const wardStatuses: PatientStatus[] = ["red", "orange", "yellow", "green", "discharged", "ghost"];

export function Dashboard({ data, actions, offlineMode }: { data: AppData; actions: AppActions; offlineMode?: boolean }) {
  const attempts = data.records.flatMap((record) => record.attempts);
  const due = data.patients.filter((patient) => patient.nextReviewAt && getTimeRemaining(patient.nextReviewAt).expired);
  const queue = getReceptionQueue(data.patients, data.exams, attempts);
  const severe = data.patients.filter((patient) => patient.status === "red" || patient.status === "orange");
  const nextExams = [...data.exams].filter((exam) => daysUntil(exam.date) >= 0).sort((a, b) => daysUntil(a.date) - daysUntil(b.date)).slice(0, 4);
  const nextExam = nextExams[0];
  const receptionSubtitle = nextExam
    ? `${nextExam.subject} está puxando a fila porque a prova está próxima.`
    : "Fila organizada pelas provas mais próximas.";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-teal-200 bg-gradient-to-br from-teal-700 to-slate-900 p-5 text-white shadow-soft dark:border-teal-800">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.08em] text-teal-100">Olá, {data.settings.studentName || "estudante"}</p>
            <h1 className="mt-2 text-3xl font-black">{data.settings.appName}</h1>
            <p className="mt-1 text-xl font-black text-teal-100">Painel Geral</p>
            <p className="mt-2 max-w-2xl text-teal-50">Modo {offlineMode ? "offline" : "online"}. Hoje vale focar nos temas da prova mais próxima e nos retornos pendentes.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn bg-white text-slate-900 hover:bg-teal-50" onClick={() => actions.navigate("settings")}><Settings size={16} /> Configurações</button>
            <button className="btn bg-teal-600 text-white hover:bg-teal-500" onClick={() => actions.setData((current) => ({ ...current, settings: { ...current.settings, darkMode: !current.settings.darkMode } }))}>
              {data.settings.darkMode ? <Sun size={16} /> : <Moon size={16} />} Modo escuro
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <Summary label="Próxima prova" value={nextExam ? `${nextExam.subject} ${formatDays(daysUntil(nextExam.date))}` : "sem prova"} icon={<CalendarDays size={20} />} />
          <Summary label="Recepção" value={`${queue.reception.length}`} icon={<UsersRound size={20} />} />
          <Summary label="Retornos" value={`${queue.returns.length}`} icon={<ClipboardList size={20} />} />
          <Summary label="Revisões vencidas" value={`${due.length}`} icon={<ClipboardList size={20} />} />
          <Summary label="Graves" value={`${severe.length}`} icon={<AlertTriangle size={20} />} />
        </div>
      </section>

      <section className="panel">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <p className="label">Agenda rápida</p>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">Provas próximas</h2>
          </div>
          <button className="btn" onClick={() => actions.navigate("treatment-plan")}>Ver plano</button>
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {nextExams.length ? nextExams.map((exam) => {
            const status = getExamStatus(exam.date);
            return (
              <button key={exam.id} className={`flex items-center justify-between gap-3 rounded-lg border-2 p-3 text-left ${status.className}`} onClick={() => actions.navigate("treatment-plan")}>
                <span className="flex items-center gap-2"><CalendarDays size={18} /> <strong>{exam.subject}</strong></span>
                <span className="text-sm font-black">{formatDays(daysUntil(exam.date))}</span>
              </button>
            );
          }) : <p className="text-sm text-slate-500 dark:text-slate-400">Nenhuma prova cadastrada nos próximos dias.</p>}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="label">Fila de entrada</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recepção</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{queue.reception.length ? receptionSubtitle : "Não há pacientes aguardando na recepção."}</p>
          </div>
          <button className="btn" onClick={() => actions.navigate("registration-center")}>Ir para Central de Cadastro</button>
        </div>
        {queue.reception.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {queue.reception.slice(0, 8).map((item) => <QueueCard key={item.patient.id} item={item} actions={actions} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Não há pacientes aguardando na recepção.</div>
        )}
      </section>

      <section className="space-y-3">
        <div>
          <p className="label">Já atendidos</p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Retornos prioritários</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Pacientes que precisam voltar por revisão, ala crítica ou prova próxima.</p>
        </div>
        {queue.returns.length ? (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {queue.returns.slice(0, 6).map((item) => <ReturnCard key={item.patient.id} item={item} actions={actions} />)}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Sem retornos prioritários agora.</div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="label">Mapa das alas</p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Hospital em funcionamento</h2>
        </div>
        {wardStatuses.map((status) => {
          const theme = getWardTheme(status);
          const patients = data.patients.filter((patient) => patient.status === status);
          return (
            <section key={status} className={`rounded-lg border-2 p-4 ${theme.backgroundClass} ${theme.borderClass}`}>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className={theme.textClass}>
                  <div className="flex items-center gap-2">
                    <WardIcon iconName={theme.iconName} size={22} />
                    <h3 className="text-xl font-black">{theme.label}</h3>
                  </div>
                  <p className="mt-1 text-sm opacity-80">{theme.description}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-sm font-black ${theme.badgeClass}`}>{patients.length} paciente(s)</span>
              </div>
              {patients.length ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {patients.map((patient) => (
                    <PatientCard
                      key={patient.id}
                      patient={patient}
                      onTriage={() => actions.navigate("triage", { patientId: patient.id })}
                      onRecord={() => actions.navigate("patient-record", { patientId: patient.id })}
                      onMedication={() => actions.navigate("pharmacy", { medicationTopic: patient.name })}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-current p-4 text-sm opacity-70">Nenhum paciente nesta ala.</div>
              )}
            </section>
          );
        })}
      </section>
    </div>
  );
}

function QueueCard({ item, actions }: { item: ReceptionQueueItem; actions: AppActions }) {
  const { patient } = item;
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <PatientAvatar patient={patient} />
        <div className="min-w-0">
          <h3 className="truncate font-black text-slate-900 dark:text-white">{patient.name}</h3>
          <p className="truncate text-sm text-slate-500 dark:text-slate-400">{patient.subject}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.exam ? `${item.exam.title}: ${formatDays(item.daysUntilExam || 0)}` : "Sem prova vinculada"}</p>
      <div className="mt-2"><StatusBadge status={patient.status} /></div>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary flex-1" onClick={() => actions.navigate("triage", { patientId: patient.id })}>Fazer triagem</button>
        <button className="btn flex-1" onClick={() => actions.navigate("pharmacy", { medicationTopic: patient.name })}>Ver teoria</button>
      </div>
    </article>
  );
}

function ReturnCard({ item, actions }: { item: ReceptionQueueItem; actions: AppActions }) {
  const { patient } = item;
  return (
    <article className="panel">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-black text-slate-900 dark:text-white">{patient.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{patient.subject} • cura {patient.cureIndex}%</p>
        </div>
        <StatusBadge status={patient.status} />
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{item.exam ? `${item.exam.title}: ${formatDays(item.daysUntilExam || 0)}` : item.reason}</p>
      <div className="mt-4 flex gap-2">
        <button className="btn btn-primary flex-1" onClick={() => actions.navigate("triage", { patientId: patient.id })}>Revisar agora</button>
        <button className="btn flex-1" onClick={() => actions.navigate("patient-record", { patientId: patient.id })}>Prontuário</button>
      </div>
    </article>
  );
}

function Summary({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-lg bg-white/12 p-3 ring-1 ring-white/20">
      <div className="flex items-center justify-between gap-2 text-teal-100">
        {icon}
        <span className="text-lg font-black text-white">{value}</span>
      </div>
      <p className="mt-2 text-sm font-bold text-teal-50">{label}</p>
    </div>
  );
}

function formatDays(days: number) {
  if (days <= 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}
