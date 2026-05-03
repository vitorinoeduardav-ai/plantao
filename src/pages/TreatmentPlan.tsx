import { CalendarDays, CheckCircle2, ClipboardList, Edit, Plus, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AppActions } from "../App";
import { StatusBadge } from "../components/StatusBadge";
import { AppData, DailyStudyPlanItem, Exam, ExamPriority, ExamTopic } from "../types";
import { nowIso } from "../utils/dateUtils";
import { daysUntil, generateStudyPlan, getExamStatus } from "../utils/studyPlan";

const priorities: ExamPriority[] = ["low", "medium", "high", "urgent"];
const actionLabels: Record<DailyStudyPlanItem["actionType"], string> = {
  triage: "Fazer triagem",
  study_theory: "Estudar medicamento",
  review: "Revisar prontuário",
  questions: "Responder questões",
  final_review: "Revisão final",
};

export function TreatmentPlan({ data, actions }: { data: AppData; actions: AppActions }) {
  const [editing, setEditing] = useState<Exam | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", date: "", description: "", priority: "medium" as ExamPriority });
  const [topicWeights, setTopicWeights] = useState<Record<string, number>>({});
  const attempts = data.records.flatMap((record) => record.attempts);
  const generatedPreview = useMemo(() => data.dailyStudyPlan.length ? data.dailyStudyPlan : generateStudyPlan(data.exams, data.patients, attempts, data.settings), [data.dailyStudyPlan, data.exams, data.patients, attempts, data.settings]);
  const today = new Date().toISOString().slice(0, 10);
  const todayItems = data.dailyStudyPlan.filter((item) => item.date === today).slice(0, 8);
  const calendarDays = buildCalendarDays();
  const selectedExams = data.exams.filter((exam) => exam.date === selectedDate);

  function startEdit(exam?: Exam) {
    setEditing(exam || null);
    setFormOpen(true);
    setForm(exam ? { title: exam.title, subject: exam.subject, date: exam.date, description: exam.description || "", priority: exam.priority } : { title: "", subject: "", date: selectedDate || "", description: "", priority: "medium" });
    setTopicWeights(Object.fromEntries((exam?.topics || []).map((topic) => [topic.patientId, topic.weight])));
  }

  function save() {
    if (!form.title || !form.subject || !form.date) return;
    const topics: ExamTopic[] = data.patients
      .filter((patient) => topicWeights[patient.id])
      .map((patient) => ({ patientId: patient.id, topicName: patient.name, subject: patient.subject, weight: topicWeights[patient.id] as ExamTopic["weight"] }));
    actions.upsertExam({
      id: editing?.id || `exam-${crypto.randomUUID()}`,
      title: form.title,
      subject: form.subject,
      date: form.date,
      description: form.description,
      priority: form.priority,
      topics,
      createdAt: editing?.createdAt || nowIso(),
      updatedAt: nowIso(),
    });
    setFormOpen(false);
    setEditing(null);
  }

  function startItem(item: DailyStudyPlanItem) {
    if (item.actionType === "study_theory") actions.navigate("pharmacy", { medicationTopic: item.topicName });
    else if (item.actionType === "review" || item.actionType === "final_review") actions.navigate("patient-record", { patientId: item.patientId });
    else actions.navigate("triage", { patientId: item.patientId });
  }

  return (
    <div className="space-y-6">
      <section className="panel">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="label">Agenda inteligente</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Plano de Tratamento</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Veja suas provas e organize seus pacientes por prioridade.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn" onClick={() => actions.generatePlan()}><CalendarDays size={16} /> Gerar plano</button>
            <button className="btn btn-primary" onClick={() => startEdit()}><Plus size={16} /> Cadastrar prova</button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <p className="label mb-3">Calendário</p>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const exams = data.exams.filter((exam) => exam.date === day.iso);
              const main = exams[0];
              const status = main ? getExamStatus(main.date) : null;
              return (
                <button key={day.iso} onClick={() => setSelectedDate(day.iso)} className={`min-h-24 rounded-lg border p-2 text-left transition hover:border-teal-400 ${day.isCurrentMonth ? "bg-white dark:bg-slate-900" : "bg-slate-50 text-slate-400 dark:bg-slate-950"} ${selectedDate === day.iso ? "ring-2 ring-teal-500" : "border-slate-200 dark:border-slate-700"}`}>
                  <span className="text-xs font-black">{day.label}</span>
                  <div className="mt-2 space-y-1">
                    {exams.slice(0, 2).map((exam) => <span key={exam.id} className={`block truncate rounded-md border px-2 py-1 text-xs font-black ${getExamStatus(exam.date).className}`}>{exam.subject}</span>)}
                    {status && exams.length > 2 && <span className="text-xs font-bold text-slate-500">+{exams.length - 2}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel">
            <p className="label mb-2">Próximas provas</p>
            <div className="space-y-2">
              {data.exams.length ? [...data.exams].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)).slice(0, 6).map((exam) => {
                const status = getExamStatus(exam.date);
                return (
                  <button key={exam.id} className={`w-full rounded-lg border-2 p-3 text-left ${status.className}`} onClick={() => setSelectedDate(exam.date)}>
                    <div className="flex items-center justify-between gap-3"><strong>{exam.title}</strong><span className="text-sm">{formatDays(daysUntil(exam.date))}</span></div>
                    <p className="text-sm opacity-80">{exam.subject} • {exam.topics.length} tema(s)</p>
                  </button>
                );
              }) : <p className="text-sm text-slate-500">Nenhuma prova cadastrada.</p>}
            </div>
          </div>
          <div className="panel">
            <p className="label mb-2">Detalhes do dia</p>
            {selectedDate ? (
              selectedExams.length ? selectedExams.map((exam) => (
                <div key={exam.id} className="mb-3 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800">
                  <p className="font-black">{exam.title}</p>
                  <p className="text-slate-500 dark:text-slate-400">{exam.date} • {exam.subject} • prioridade {exam.priority}</p>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">{exam.topics.map((topic) => `${topic.topicName} (${topic.weight}/5)`).join(", ")}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="btn" onClick={() => actions.navigate("reception")}>Ver pacientes dessa prova</button>
                    <button className="btn" onClick={() => startEdit(exam)}><Edit size={16} /> Editar prova</button>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">Nenhuma prova neste dia.</p>
            ) : <p className="text-sm text-slate-500">Clique em um dia para ver detalhes.</p>}
          </div>
        </div>
      </section>

      {formOpen && (
        <section className="panel border-teal-300">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="label">Cadastro</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{editing ? "Editar prova" : "Cadastrar prova"}</h3>
            </div>
            <button className="btn" onClick={() => setFormOpen(false)}><X size={16} /> Fechar</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="field" placeholder="Título da prova" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <input className="field" placeholder="Matéria" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
            <input className="field" type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            <select className="field" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as ExamPriority })}>{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}</select>
            <textarea className="field min-h-20 md:col-span-2" placeholder="Descrição opcional" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          </div>
          <div className="mt-4">
            <p className="label mb-2">Temas e pesos</p>
            <div className="grid max-h-80 gap-2 overflow-auto md:grid-cols-2">
              {data.patients.map((patient) => (
                <label key={patient.id} className="flex items-center gap-2 rounded-md border border-slate-200 p-2 text-sm dark:border-slate-700">
                  <input type="checkbox" checked={Boolean(topicWeights[patient.id])} onChange={(event) => setTopicWeights((current) => {
                    const next = { ...current };
                    if (event.target.checked) next[patient.id] = 3;
                    else delete next[patient.id];
                    return next;
                  })} />
                  <span className="min-w-0 flex-1"><strong>{patient.name}</strong><br /><span className="text-slate-500">{patient.subject}</span></span>
                  <select className="field w-20" disabled={!topicWeights[patient.id]} value={topicWeights[patient.id] || 3} onChange={(event) => setTopicWeights((current) => ({ ...current, [patient.id]: Number(event.target.value) }))}>{[1, 2, 3, 4, 5].map((weight) => <option key={weight} value={weight}>{weight}</option>)}</select>
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary mt-4" onClick={save}><Plus size={16} /> {editing ? "Salvar prova" : "Cadastrar prova"}</button>
        </section>
      )}

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="panel">
          <p className="label">Plano de Hoje</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{todayItems.length ? "O que estudar hoje" : "Hoje está leve"}</h3>
          <div className="mt-3 space-y-3">
            {todayItems.length ? todayItems.map((item) => <PlanItem key={item.id} item={item} data={data} onStart={() => startItem(item)} onToggle={() => actions.togglePlanItem(item.id)} />) : <p className="text-sm text-slate-500">Gere um plano ou cadastre provas para receber recomendações diárias.</p>}
          </div>
        </div>
        <div className="panel">
          <p className="label">Plano da Semana</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {Array.from({ length: 7 }, (_, index) => {
              const date = new Date();
              date.setDate(date.getDate() + index);
              const iso = date.toISOString().slice(0, 10);
              const items = generatedPreview.filter((item) => item.date === iso).slice(0, 4);
              return (
                <div key={iso} className="rounded-md border border-slate-200 p-3 dark:border-slate-700">
                  <p className="font-black">{new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "2-digit" }).format(new Date(`${iso}T00:00:00`))}</p>
                  <div className="mt-2 space-y-1 text-sm">{items.length ? items.map((item) => <p key={item.id}>• {item.subject}: {item.topicName}</p>) : <p className="text-slate-500">Sem blocos sugeridos.</p>}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function PlanItem({ item, data, onStart, onToggle }: { item: DailyStudyPlanItem; data: AppData; onStart: () => void; onToggle: () => void }) {
  const patient = data.patients.find((candidate) => candidate.id === item.patientId);
  return (
    <div className={`rounded-md border p-3 ${item.completed ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}>
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <p className="font-black">{item.topicName} — {actionLabels[item.actionType]}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.reason}</p>
          {patient && <div className="mt-2"><StatusBadge status={patient.status} /></div>}
        </div>
        <div className="flex gap-2">
          <button className="btn" onClick={onStart}><ClipboardList size={16} /> Começar</button>
          <button className="btn" onClick={onToggle}><CheckCircle2 size={16} /> {item.completed ? "Concluído" : "Marcar"}</button>
        </div>
      </div>
    </div>
  );
}

function buildCalendarDays() {
  const today = new Date();
  const first = new Date(today.getFullYear(), today.getMonth(), 1);
  const start = new Date(first);
  start.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { iso: date.toISOString().slice(0, 10), label: date.getDate(), isCurrentMonth: date.getMonth() === today.getMonth() };
  });
}

function formatDays(days: number) {
  if (days <= 0) return "hoje";
  if (days === 1) return "amanhã";
  return `em ${days} dias`;
}
