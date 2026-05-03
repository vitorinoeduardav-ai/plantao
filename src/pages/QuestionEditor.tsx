import { useEffect, useState } from "react";
import { AppActions } from "../App";
import { ImageUploader } from "../components/ImageUploader";
import { AppData, Question } from "../types";
import { nowIso } from "../utils/dateUtils";
import { validateQuestion } from "../utils/importExport";

const blank: Question = {
  id: "",
  subject: "",
  topic: "",
  difficulty: "easy",
  statement: "",
  alternatives: ["", "", "", "", ""],
  correctAnswer: "",
  explanation: "",
  hint: "",
  relatedFormula: "",
  tags: [],
  createdAt: "",
  updatedAt: "",
};

export function QuestionEditor({ data, actions, selectedQuestionId, userId }: { data: AppData; actions: AppActions; selectedQuestionId?: string; userId?: string }) {
  const [question, setQuestion] = useState<Question>(blank);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const found = data.questions.find((item) => item.id === selectedQuestionId);
    setQuestion(found || { ...blank, id: `q-${crypto.randomUUID()}`, createdAt: nowIso(), updatedAt: nowIso() });
  }, [selectedQuestionId]);

  function save() {
    const normalized = { ...question, alternatives: question.alternatives.filter(Boolean), tags: String(question.tags || "").toString().split(",").map((tag) => tag.trim()).filter(Boolean), updatedAt: nowIso(), createdAt: question.createdAt || nowIso() } as Question;
    const nextErrors = validateQuestion(normalized);
    setErrors(nextErrors);
    if (nextErrors.length) return;
    actions.upsertQuestion(normalized);
    actions.navigate("question-bank");
  }

  return (
    <div className="space-y-4">
      <div className="panel grid gap-3 md:grid-cols-2">
        <Field label="ID" value={question.id} onChange={(value) => setQuestion({ ...question, id: value })} />
        <Field label="Matéria" value={question.subject} onChange={(value) => setQuestion({ ...question, subject: value })} />
        <Field label="Tema/paciente" value={question.topic} onChange={(value) => setQuestion({ ...question, topic: value })} />
        <label><span className="label">Dificuldade</span><select className="field mt-1" value={question.difficulty} onChange={(event) => setQuestion({ ...question, difficulty: event.target.value as Question["difficulty"] })}><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></select></label>
        <label className="md:col-span-2"><span className="label">Enunciado</span><textarea className="field mt-1 min-h-28" value={question.statement} onChange={(event) => setQuestion({ ...question, statement: event.target.value })} /></label>
        <div className="md:col-span-2">
          <p className="label mb-2">Alternativas</p>
          <div className="grid gap-2">{question.alternatives.map((alt, index) => <input key={index} className="field" placeholder={`Alternativa ${index + 1}`} value={alt} onChange={(event) => setQuestion({ ...question, alternatives: question.alternatives.map((item, i) => i === index ? event.target.value : item) })} />)}</div>
        </div>
        <Field label="Resposta correta" value={question.correctAnswer} onChange={(value) => setQuestion({ ...question, correctAnswer: value })} />
        <Field label="Fórmula relacionada" value={question.relatedFormula || ""} onChange={(value) => setQuestion({ ...question, relatedFormula: value })} />
        <label className="md:col-span-2"><span className="label">Explicação</span><textarea className="field mt-1 min-h-24" value={question.explanation} onChange={(event) => setQuestion({ ...question, explanation: event.target.value })} /></label>
        <Field label="Dica" value={question.hint || ""} onChange={(value) => setQuestion({ ...question, hint: value })} />
        <Field label="Tags separadas por vírgula" value={(question.tags || []).join(", ")} onChange={(value) => setQuestion({ ...question, tags: value.split(",").map((tag) => tag.trim()) })} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ImageUploader label="Imagem do enunciado" value={question.image} userId={userId} kind="question" onChange={(image) => setQuestion({ ...question, image })} />
        <ImageUploader label="Imagem da explicação" value={question.explanationImage} userId={userId} kind="explanation" onChange={(image) => setQuestion({ ...question, explanationImage: image })} />
      </div>
      {errors.length > 0 && <div className="panel border-rose-200 bg-rose-50 text-sm text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
      <button className="btn btn-primary" onClick={save}>Salvar questão</button>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="label">{label}</span><input className="field mt-1" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
