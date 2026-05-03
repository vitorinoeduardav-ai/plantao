import { BarChart3 } from "lucide-react";
import { AppActions } from "../App";
import { StatsCard } from "../components/StatsCard";
import { statusLabels } from "../components/StatusBadge";
import { AppData } from "../types";

export function Statistics({ data }: { data: AppData; actions: AppActions }) {
  const attempts = data.records.flatMap((record) => record.attempts);
  const responses = attempts.flatMap((attempt) => attempt.responses);
  const accuracy = responses.length ? Math.round(responses.filter((response) => response.isCorrect).length / responses.length * 100) : 0;
  const highConfidenceWrong = responses.filter((response) => !response.isCorrect && response.confidence === 4);
  const avgTime = responses.filter((response) => response.timeSpentSeconds).length ? Math.round(responses.reduce((sum, response) => sum + (response.timeSpentSeconds || 0), 0) / responses.filter((response) => response.timeSpentSeconds).length) : 0;
  const byStatus = data.patients.reduce<Record<string, number>>((acc, patient) => ({ ...acc, [patient.status]: (acc[patient.status] || 0) + 1 }), {});
  const subjectStats = data.questions.reduce<Record<string, { done: number; ok: number }>>((acc, question) => {
    const questionResponses = responses.filter((response) => response.questionId === question.id);
    const current = acc[question.subject] || { done: 0, ok: 0 };
    return { ...acc, [question.subject]: { done: current.done + questionResponses.length, ok: current.ok + questionResponses.filter((response) => response.isCorrect).length } };
  }, {});
  const worstPatients = [...data.patients].sort((a, b) => a.cureIndex - b.cureIndex).slice(0, 5);

  return (
    <div className="space-y-5">
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Questões feitas" value={responses.length} icon={<BarChart3 />} />
        <StatsCard label="Taxa geral de acerto" value={`${accuracy}%`} icon={<BarChart3 />} />
        <StatsCard label="Erros com confiança 4" value={highConfidenceWrong.length} icon={<BarChart3 />} />
        <StatsCard label="Tempo médio" value={avgTime ? `${avgTime}s` : "n/d"} icon={<BarChart3 />} />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="panel">
          <p className="label mb-3">Pacientes por ala</p>
          {Object.entries(statusLabels).map(([status, label]) => <Bar key={status} label={label} value={byStatus[status] || 0} max={data.patients.length || 1} />)}
        </div>
        <div className="panel">
          <p className="label mb-3">Acerto por matéria</p>
          {Object.entries(subjectStats).map(([subject, stat]) => <Bar key={subject} label={`${subject} (${stat.done})`} value={stat.done ? Math.round(stat.ok / stat.done * 100) : 0} max={100} suffix="%" />)}
        </div>
        <div className="panel">
          <p className="label mb-3">Pacientes mais graves</p>
          <div className="space-y-2">{worstPatients.map((patient) => <Bar key={patient.id} label={patient.name} value={patient.cureIndex} max={100} suffix="%" />)}</div>
        </div>
        <div className="panel">
          <p className="label mb-3">Altas e fantasmas</p>
          <Bar label="Altas" value={data.patients.filter((patient) => patient.status === "discharged").length} max={data.patients.length || 1} />
          <Bar label="Fantasmas" value={data.patients.filter((patient) => patient.status === "ghost").length} max={data.patients.length || 1} />
        </div>
      </section>
    </div>
  );
}

function Bar({ label, value, max, suffix = "" }: { label: string; value: number; max: number; suffix?: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-sm"><span>{label}</span><strong>{value}{suffix}</strong></div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-2 rounded-full bg-teal-600" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} /></div>
    </div>
  );
}
