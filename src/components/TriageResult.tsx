import { PatientStatus, TriageResponse } from "../types";
import { wardMessages } from "../utils/classifyPatient";
import { StatusBadge } from "./StatusBadge";

export function TriageResult({ cureIndex, status, responses, onRecord, onAgain }: { cureIndex: number; status: PatientStatus; responses: TriageResponse[]; onRecord: () => void; onAgain: () => void }) {
  const lucky = responses.filter((response) => response.isCorrect && response.confidence === 1).length;
  const overconfident = responses.filter((response) => !response.isCorrect && response.confidence === 4).length;
  return (
    <div className="panel">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="label">Diagnóstico</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Índice de Cura: {cureIndex}%</h2>
        </div>
        <StatusBadge status={status} />
      </div>
      <p className="mt-4 text-slate-600 dark:text-slate-300">{wardMessages[status]}</p>
      {lucky > 0 && <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">Você acertou {lucky} questão(ões) chutando. O tema ainda merece revisão.</p>}
      {overconfident > 0 && <p className="mt-3 rounded-md bg-rose-50 p-3 text-sm text-rose-900 dark:bg-rose-950 dark:text-rose-100">{overconfident} erro(s) com confiança total reduziram o índice final.</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={onRecord}>Ver prontuário</button>
        <button className="btn" onClick={onAgain}>Nova triagem</button>
      </div>
    </div>
  );
}
