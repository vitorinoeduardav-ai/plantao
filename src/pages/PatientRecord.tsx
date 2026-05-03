import { AppActions } from "../App";
import { EmptyState } from "../components/EmptyState";
import { HeartMeter } from "../components/HeartMeter";
import { PatientAvatar } from "../components/PatientAvatar";
import { StatusBadge } from "../components/StatusBadge";
import { AppData } from "../types";
import { formatDateTime } from "../utils/dateUtils";
import { ReactNode } from "react";
import { getWardTheme } from "../utils/getWardTheme";
import { calculateStudyPriority, daysUntil } from "../utils/studyPlan";

export function PatientRecord({ data, actions, selectedPatientId }: { data: AppData; actions: AppActions; selectedPatientId?: string }) {
  const patient = data.patients.find((item) => item.id === selectedPatientId) || data.patients[0];
  if (!patient) return <EmptyState title="Sem prontuário" description="Nenhum paciente selecionado." />;
  const record = data.records.find((item) => item.patientId === patient.id);
  const medicationNames = record?.recommendedMedications || [];
  const theme = getWardTheme(patient.status);
  const examsForPatient = data.exams
    .map((exam) => {
      const topic = exam.topics.find((item) => item.patientId === patient.id || item.topicName === patient.name);
      if (!topic) return null;
      return { exam, topic, days: daysUntil(exam.date), score: calculateStudyPriority(patient, exam, topic.weight, daysUntil(exam.date), record?.attempts || []) };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.days - b.days);

  return (
    <div className="space-y-5">
      <section className={`rounded-lg border-2 p-4 shadow-sm ${theme.backgroundClass} ${theme.borderClass}`}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex items-center gap-4">
            <PatientAvatar patient={patient} size="lg" />
            <div>
              <p className="label">Prontuário do paciente</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">{patient.subject}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-4">
          <Info label="Índice de cura" value={`${patient.cureIndex}%`} />
          <Info label="Corações" value={<HeartMeter hearts={patient.hearts} />} />
          <Info label="Tentativas" value={patient.attempts} />
          <Info label="Próxima revisão" value={formatDateTime(patient.nextReviewAt)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => actions.navigate("triage", { patientId: patient.id })}>Atender novamente</button>
          <button className="btn" onClick={() => actions.navigate("pharmacy", { medicationTopic: patient.name })}>Estudar medicamento</button>
        </div>
      </section>
      <section className="panel">
        <p className="label mb-2">Medicamentos recomendados</p>
        <div className="flex flex-wrap gap-2">{medicationNames.length ? medicationNames.map((name) => <span key={name} className="rounded-full bg-lime-100 px-3 py-1 text-sm font-bold text-lime-800 dark:bg-lime-950 dark:text-lime-200">{name}</span>) : "Nenhuma recomendação ainda."}</div>
      </section>
      <section className="panel">
        <p className="label mb-2">Provas vinculadas</p>
        {examsForPatient.length ? (
          <div className="grid gap-3 md:grid-cols-2">
            {examsForPatient.map(({ exam, topic, days, score }) => (
              <div key={exam.id} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
                <p className="font-black">{exam.title}</p>
                <p className="text-slate-500 dark:text-slate-400">{days < 0 ? "Prova passada" : `Cai em ${days} dia(s)`} • peso {topic.weight}/5</p>
                <p className="mt-1 font-bold text-teal-700 dark:text-teal-300">Prioridade atual: {score}</p>
                <p className="mt-1 text-slate-600 dark:text-slate-300">Este paciente cai na prova de {exam.subject}. {patient.cureIndex < 60 ? "Reforce teoria e questões até a prova." : "Mantenha revisão espaçada e confira erros recentes."}</p>
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-slate-500">Este paciente ainda não está vinculado a nenhuma prova.</p>}
      </section>
      <section className="space-y-3">
        <h3 className="text-lg font-black text-slate-900 dark:text-white">Histórico de tentativas</h3>
        {record?.attempts.length ? record.attempts.map((attempt) => (
          <details key={attempt.id} className="panel">
            <summary className="cursor-pointer font-bold">{formatDateTime(attempt.date)} • {attempt.cureIndex}% • {attempt.previousStatus} → {attempt.newStatus}</summary>
            <div className="mt-3 grid gap-2">
              {attempt.responses.map((response) => {
                const question = data.questions.find((item) => item.id === response.questionId);
                return (
                  <div key={response.questionId} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
                    <p className="font-bold">{question?.statement || response.questionId}</p>
                    <p className={response.isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>{response.isCorrect ? "Acertou" : "Errou"} com confiança {response.confidence}</p>
                    {!response.isCorrect && <p>Marcada: {response.selectedAnswer}. Correta: {response.correctAnswer}</p>}
                    {!response.isCorrect && response.confidence === 4 && <p className="font-bold text-rose-700 dark:text-rose-300">Erro com alta confiança.</p>}
                  </div>
                );
              })}
            </div>
          </details>
        )) : <EmptyState title="Ainda sem tentativas" description="Faça a primeira triagem para abrir o prontuário." />}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return <div className="rounded-md bg-slate-50 p-3 dark:bg-slate-800"><p className="label">{label}</p><div className="mt-1 font-black">{value}</div></div>;
}
