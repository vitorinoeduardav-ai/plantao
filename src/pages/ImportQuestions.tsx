import { useState } from "react";
import { AppActions } from "../App";
import { ImportJsonBox } from "../components/ImportJsonBox";
import { AppData, ImportConflictMode, Question } from "../types";
import { parseQuestionsJson } from "../utils/importExport";

export function ImportQuestions({ actions }: { data: AppData; actions: AppActions }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [mode, setMode] = useState<ImportConflictMode>("ignore");
  const [createPatients, setCreatePatients] = useState(true);

  function parse(json: string) {
    const result = parseQuestionsJson(json);
    setQuestions(result.questions);
    setErrors(result.errors);
  }

  return (
    <div className="space-y-4">
      <ImportJsonBox onParse={parse} />
      {errors.length > 0 && <div className="panel border-amber-200 bg-amber-50 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
      {questions.length > 0 && (
        <div className="panel">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="label">Prévia</p>
              <h2 className="text-xl font-black">{questions.length} questão(ões) válidas</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="field w-auto" value={mode} onChange={(event) => setMode(event.target.value as ImportConflictMode)}>
                <option value="ignore">Ignorar duplicatas</option>
                <option value="replace">Substituir duplicatas</option>
                <option value="duplicate">Duplicar com novo id</option>
              </select>
              <label className="btn"><input type="checkbox" checked={createPatients} onChange={(event) => setCreatePatients(event.target.checked)} /> Criar pacientes novos</label>
              <button className="btn btn-primary" onClick={() => { actions.importQuestions(questions, mode, createPatients); actions.navigate("question-bank"); }}>Importar válidas</button>
            </div>
          </div>
          <div className="mt-4 grid gap-2">
            {questions.slice(0, 8).map((question) => <div key={question.id} className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800"><strong>{question.id}</strong> • {question.subject} • {question.topic}<br />{question.statement}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
