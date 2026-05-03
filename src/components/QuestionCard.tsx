import { Lightbulb } from "lucide-react";
import { useState } from "react";
import { Question, TriageResponse } from "../types";
import { AlternativeList } from "./AlternativeList";
import { ConfidenceSelector } from "./ConfidenceSelector";
import { StoredImage } from "./StoredImage";

export function QuestionCard({ question, index, total, onAnswered }: { question: Question; index: number; total: number; onAnswered: (response: TriageResponse) => void }) {
  const [selected, setSelected] = useState("");
  const [crossed, setCrossed] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<TriageResponse["confidence"]>(2);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [startedAt] = useState(Date.now());

  const isCorrect = selected === question.correctAnswer;

  function answer() {
    if (!selected) return;
    setAnswered(true);
  }

  function next() {
    onAnswered({
      questionId: question.id,
      selectedAnswer: selected,
      correctAnswer: question.correctAnswer,
      isCorrect,
      confidence,
      timeSpentSeconds: Math.round((Date.now() - startedAt) / 1000),
    });
  }

  return (
    <article className="panel">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">Questão {index + 1}/{total}</span>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-200">{question.difficulty}</span>
      </div>
      <h2 className="text-lg font-black text-slate-900 dark:text-white">{question.statement}</h2>
      {question.image && <StoredImage image={question.image} />}
      <div className="mt-4">
        <AlternativeList alternatives={question.alternatives} selected={selected} crossed={crossed} locked={answered} correctAnswer={question.correctAnswer} onSelect={setSelected} onToggleCross={(answer) => setCrossed((values) => values.includes(answer) ? values.filter((item) => item !== answer) : [...values, answer])} />
      </div>
      <div className="mt-4">
        <ConfidenceSelector value={confidence} onChange={setConfidence} />
      </div>
      {question.hint && (
        <div className="mt-4">
          <button className="btn" onClick={() => setShowHint(true)}><Lightbulb size={16} /> Pedir dica</button>
          {showHint && <p className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">{question.hint}</p>}
        </div>
      )}
      {answered && (
        <div className={`mt-4 rounded-lg border p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"}`}>
          <p className="font-bold">{isCorrect ? "Resposta correta." : "Resposta incorreta."}</p>
          <p className="mt-1 text-sm">{question.explanation}</p>
          {question.explanationImage && <StoredImage image={question.explanationImage} />}
          {question.relatedFormula && <p className="mt-2 text-sm font-semibold">Fórmula: {question.relatedFormula}</p>}
        </div>
      )}
      <div className="mt-4 flex justify-end">
        {!answered ? <button className="btn btn-primary" disabled={!selected} onClick={answer}>Responder</button> : <button className="btn btn-primary" onClick={next}>Avançar</button>}
      </div>
    </article>
  );
}
