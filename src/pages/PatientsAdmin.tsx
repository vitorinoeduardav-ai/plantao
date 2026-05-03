import { Plus } from "lucide-react";
import { useState } from "react";
import { AppActions } from "../App";
import { avatarGallery, getDefaultAvatarForSubject } from "../data/avatarGallery";
import { ImageUploader } from "../components/ImageUploader";
import { PatientAvatar } from "../components/PatientAvatar";
import { AppData, Patient, QuestionImage } from "../types";
import { nowIso } from "../utils/dateUtils";

export function PatientsAdmin({ data, actions, userId }: { data: AppData; actions: AppActions; userId?: string }) {
  const [editing, setEditing] = useState<Patient | null>(null);
  const [form, setForm] = useState({ name: "", subject: "", description: "", avatarAlt: "" });
  const [avatar, setAvatar] = useState<QuestionImage | undefined>();
  const [subjectFilter, setSubjectFilter] = useState("Todos");
  const gallerySubjects = ["Todos", ...Array.from(new Set(avatarGallery.map((item) => item.subject)))];
  const filteredGallery = avatarGallery.filter((option) => subjectFilter === "Todos" || option.subject === subjectFilter);

  function startEdit(patient?: Patient) {
    setEditing(patient || null);
    setForm(patient ? { name: patient.name, subject: patient.subject, description: patient.description || "", avatarAlt: patient.avatarAlt || "" } : { name: "", subject: "", description: "", avatarAlt: "" });
    setAvatar(patient?.avatarUrl ? { id: patient.avatarUrl, src: patient.avatarUrl, alt: patient.avatarAlt || patient.name } : undefined);
  }

  function save() {
    if (!form.name.trim() || !form.subject.trim()) return;
    const patient: Patient = {
      id: editing?.id || `${form.subject}-${form.name}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      name: form.name.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
      status: editing?.status || "not_triaged",
      cureIndex: editing?.cureIndex || 0,
      hearts: editing?.hearts || 3,
      attempts: editing?.attempts || 0,
      consecutiveGreen: editing?.consecutiveGreen || 0,
      nextReviewAt: editing?.nextReviewAt,
      lastReviewAt: editing?.lastReviewAt,
      createdAt: editing?.createdAt || nowIso(),
      updatedAt: nowIso(),
      tags: [form.subject, form.name],
      avatarUrl: avatar?.src,
      avatarAlt: form.avatarAlt || avatar?.alt,
      avatarStyle: avatar?.src?.startsWith("avatar://") ? avatar.src.replace("avatar://", "") : undefined,
    };
    actions.upsertPatient(patient);
    startEdit();
  }

  return (
    <div className="space-y-5">
      <div className="panel">
        <p className="label">Administração</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Gerenciar pacientes e avatares</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input className="field" placeholder="Nome do tema" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <input className="field" placeholder="Matéria" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
          <input className="field md:col-span-2" placeholder="Descrição opcional" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
          <input className="field md:col-span-2" placeholder="Texto alternativo do avatar" value={form.avatarAlt} onChange={(event) => setForm({ ...form, avatarAlt: event.target.value })} />
        </div>
        <div className="mt-4">
          <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="label">Galeria de personagens</p>
            <select className="field w-full sm:w-56" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
              {gallerySubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
            </select>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {filteredGallery.map((option) => (
              <button key={option.id} className={`rounded-lg border p-3 text-left transition hover:border-teal-400 ${avatar?.src === option.src ? "border-teal-600 bg-teal-50 dark:bg-teal-950" : "border-slate-200 dark:border-slate-700"}`} onClick={() => {
                setAvatar({ id: option.id, src: option.src, alt: option.alt });
                setForm((current) => ({ ...current, avatarAlt: option.alt }));
              }}>
                <div className="flex items-center gap-3">
                  <PatientAvatar patient={{ id: option.id, name: option.name, subject: option.subject, status: "not_triaged", cureIndex: 0, hearts: 3, attempts: 0, consecutiveGreen: 0, createdAt: nowIso(), updatedAt: nowIso(), avatarUrl: option.src, avatarAlt: option.alt }} />
                  <div>
                    <p className="text-sm font-black">{option.name}</p>
                    <p className="text-xs font-bold text-slate-500">{option.subject}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <ImageUploader label="Upload de avatar" value={avatar} userId={userId} kind="avatar" onChange={setAvatar} />
          <div className="flex items-end gap-2">
            <button className="btn btn-primary" onClick={save}><Plus size={16} /> {editing ? "Salvar paciente" : "Cadastrar paciente"}</button>
            <button className="btn" onClick={() => {
              const fallback = getDefaultAvatarForSubject(form.subject);
              setAvatar({ id: fallback.id, src: fallback.src, alt: fallback.alt });
              setForm((current) => ({ ...current, avatarAlt: fallback.alt }));
            }}>Usar padrão da matéria</button>
            <button className="btn" onClick={() => setAvatar(undefined)}>Remover avatar</button>
            {editing && <button className="btn" onClick={() => startEdit()}>Cancelar</button>}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.patients.map((patient) => (
          <PatientAvatarRow key={patient.id} patient={patient} onEdit={() => startEdit(patient)} onDelete={() => window.confirm("Excluir este paciente?") && actions.deletePatient(patient.id)} />
        ))}
      </div>
    </div>
  );
}

function PatientAvatarRow({ patient, onEdit, onDelete }: { patient: Patient; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="panel flex items-center gap-3">
      <PatientAvatar patient={patient} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-black">{patient.name}</p>
        <p className="truncate text-sm text-slate-500">{patient.subject}</p>
      </div>
      <button className="btn" onClick={onEdit}>Editar</button>
      <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={onDelete}>Excluir</button>
    </div>
  );
}
