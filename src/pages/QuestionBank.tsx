import { Copy, Download, Edit, Eye, Play, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { AppActions } from "../App";
import { EmptyState } from "../components/EmptyState";
import { AppData } from "../types";
import { downloadJson } from "../utils/importExport";

export function QuestionBank({ data, actions }: { data: AppData; actions: AppActions }) {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [query, setQuery] = useState("");
  const [previewId, setPreviewId] = useState<string>();
  const subjects = Array.from(new Set(data.questions.map((question) => question.subject)));
  const topics = Array.from(new Set(data.questions.map((question) => question.topic)));
  const questions = useMemo(() => data.questions.filter((question) =>
    (!subject || question.subject === subject) &&
    (!topic || question.topic === topic) &&
    (!difficulty || question.difficulty === difficulty) &&
    `${question.statement} ${question.tags?.join(" ")}`.toLowerCase().includes(query.toLowerCase())
  ), [data.questions, subject, topic, difficulty, query]);
  const preview = data.questions.find((question) => question.id === previewId);

  return (
    <div className="space-y-4">
      <div className="panel grid gap-3 md:grid-cols-5">
        <input className="field" placeholder="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} />
        <select className="field" value={subject} onChange={(event) => setSubject(event.target.value)}><option value="">Matéria</option>{subjects.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="field" value={topic} onChange={(event) => setTopic(event.target.value)}><option value="">Tema</option>{topics.map((item) => <option key={item}>{item}</option>)}</select>
        <select className="field" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}><option value="">Dificuldade</option><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></select>
        <button className="btn btn-primary" onClick={() => downloadJson("questoes-plantao.json", data.questions)}><Download size={16} /> Exportar</button>
      </div>
      {preview && (
        <div className="panel">
          <p className="label">Visualização</p>
          <h3 className="mt-1 font-black">{preview.statement}</h3>
          <ol className="mt-2 list-decimal pl-5 text-sm">{preview.alternatives.map((alt) => <li key={alt}>{alt}</li>)}</ol>
          <p className="mt-2 text-sm"><strong>Resposta:</strong> {preview.correctAnswer}</p>
          <p className="text-sm"><strong>Explicação:</strong> {preview.explanation}</p>
        </div>
      )}
      <div className="grid gap-3">
        {questions.length ? questions.map((question) => (
          <article key={question.id} className="panel">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <p className="label">{question.subject} • {question.topic} • {question.difficulty}</p>
                <h3 className="font-black text-slate-900 dark:text-white">{question.statement}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn" title="Visualizar" onClick={() => setPreviewId(question.id)}><Eye size={16} /></button>
                <button className="btn" title="Testar" onClick={() => actions.navigate("triage", { patientId: data.patients.find((patient) => patient.name === question.topic)?.id })}><Play size={16} /></button>
                <button className="btn" title="Editar" onClick={() => actions.navigate("question-editor", { questionId: question.id })}><Edit size={16} /></button>
                <button className="btn" title="Duplicar" onClick={() => actions.duplicateQuestion(question.id)}><Copy size={16} /></button>
                <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" title="Excluir" onClick={() => window.confirm("Excluir questão?") && actions.deleteQuestion(question.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          </article>
        )) : <EmptyState title="Nenhuma questão encontrada" description="Ajuste os filtros ou cadastre uma nova questão." />}
      </div>
    </div>
  );
}
