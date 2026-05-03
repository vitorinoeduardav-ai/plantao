import { useMemo, useState } from "react";
import { AppActions } from "../App";
import { EmptyState } from "../components/EmptyState";
import { QuestionCard } from "../components/QuestionCard";
import { TriageResult } from "../components/TriageResult";
import { AppData, PatientStatus, TriageResponse } from "../types";

export function Triage({ data, actions, selectedPatientId }: { data: AppData; actions: AppActions; selectedPatientId?: string }) {
  const patient = data.patients.find((item) => item.id === selectedPatientId) || data.patients[0];
  const [responses, setResponses] = useState<TriageResponse[]>([]);
  const [result, setResult] = useState<{ cureIndex: number; status: PatientStatus } | null>(null);

  const questions = useMemo(() => {
    if (!patient) return [];
    const exact = data.questions.filter((question) => question.topic === patient.name);
    const related = data.questions.filter((question) => question.subject === patient.subject && !exact.includes(question));
    return [...exact, ...related].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [data.questions, patient?.id]);

  if (!patient) return <EmptyState title="Sem pacientes" description="Cadastre um paciente na recepção para começar." />;
  if (questions.length < 1) return <EmptyState title="Sem questões para este tema" description="Cadastre ou importe questões relacionadas ao paciente." />;
  if (result) return <TriageResult cureIndex={result.cureIndex} status={result.status} responses={responses} onRecord={() => actions.navigate("patient-record", { patientId: patient.id })} onAgain={() => { setResponses([]); setResult(null); }} />;

  const current = questions[responses.length];
  if (!current) {
    const triageResult = actions.finishTriage(patient.id, responses);
    setResult(triageResult);
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="panel">
        <p className="label">Triagem em andamento</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">{patient.name}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{patient.subject} • {questions.length} questões selecionadas</p>
      </div>
      <QuestionCard
        key={current.id}
        question={current}
        index={responses.length}
        total={questions.length}
        onAnswered={(response) => {
          const next = [...responses, response];
          setResponses(next);
          if (next.length === questions.length) setResult(actions.finishTriage(patient.id, next));
        }}
      />
    </div>
  );
}
