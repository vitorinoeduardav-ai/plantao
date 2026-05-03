import { useState } from "react";
import { AppActions } from "../App";
import { ImageUploader } from "../components/ImageUploader";
import { TheoryMedicationCard } from "../components/TheoryMedicationCard";
import { AppData, QuestionImage, TheoryMedication } from "../types";
import { theoryService } from "../services/theoryService";
import { nowIso } from "../utils/dateUtils";

export function MedicationsAdmin({ data, actions, userId }: { data: AppData; actions: AppActions; userId?: string }) {
  const [editing, setEditing] = useState<TheoryMedication | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", topic: "", summary: "", formulas: "", whenToUse: "", commonMistakes: "", solvedExample: "" });
  const [image, setImage] = useState<QuestionImage | undefined>();

  function edit(medication?: TheoryMedication) {
    setEditing(medication || null);
    setImage(medication?.image);
    setForm(medication ? {
      title: medication.title,
      subject: medication.subject,
      topic: medication.topic,
      summary: medication.summary,
      formulas: medication.formulas.join("\n"),
      whenToUse: medication.whenToUse.join("\n"),
      commonMistakes: medication.commonMistakes.join("\n"),
      solvedExample: medication.solvedExample,
    } : { title: "", subject: "", topic: "", summary: "", formulas: "", whenToUse: "", commonMistakes: "", solvedExample: "" });
  }

  function save() {
    if (!form.title || !form.topic || !form.subject || !form.summary) return;
    const medication: TheoryMedication = {
      id: editing?.id || `med-${crypto.randomUUID()}`,
      title: form.title,
      subject: form.subject,
      topic: form.topic,
      summary: form.summary,
      formulas: form.formulas.split("\n").map((item) => item.trim()).filter(Boolean),
      whenToUse: form.whenToUse.split("\n").map((item) => item.trim()).filter(Boolean),
      commonMistakes: form.commonMistakes.split("\n").map((item) => item.trim()).filter(Boolean),
      solvedExample: form.solvedExample,
      flashcards: editing?.flashcards || [],
      image,
      createdAt: editing?.createdAt || nowIso(),
      updatedAt: nowIso(),
    };
    actions.setData((current) => ({ ...current, medications: current.medications.some((item) => item.id === medication.id) ? current.medications.map((item) => item.id === medication.id ? medication : item) : [...current.medications, medication] }));
    if (userId) {
      const remote = editing ? theoryService.update(userId, editing.id, medication) : theoryService.create(userId, medication);
      remote.then((saved) => actions.setData((current) => ({ ...current, medications: current.medications.map((item) => item.id === medication.id ? saved : item) }))).catch(console.error);
    }
    edit();
  }

  return (
    <div className="space-y-4">
      <div className="panel grid gap-3 md:grid-cols-2">
        <div className="md:col-span-2">
          <p className="label">Administração</p>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Gerenciar medicamentos e teorias</h2>
        </div>
        <input className="field" placeholder="Título" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
        <input className="field" placeholder="Matéria" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
        <input className="field" placeholder="Tema/paciente" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} />
        <input className="field" placeholder="Resumo simples" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
        <textarea className="field min-h-24" placeholder="Fórmulas, uma por linha" value={form.formulas} onChange={(event) => setForm({ ...form, formulas: event.target.value })} />
        <textarea className="field min-h-24" placeholder="Quando usar, um por linha" value={form.whenToUse} onChange={(event) => setForm({ ...form, whenToUse: event.target.value })} />
        <textarea className="field min-h-24" placeholder="Erros comuns, um por linha" value={form.commonMistakes} onChange={(event) => setForm({ ...form, commonMistakes: event.target.value })} />
        <textarea className="field min-h-24" placeholder="Exemplo resolvido" value={form.solvedExample} onChange={(event) => setForm({ ...form, solvedExample: event.target.value })} />
        <div className="md:col-span-2">
          <ImageUploader label="Imagem do medicamento" value={image} userId={userId} kind="medication" onChange={setImage} />
        </div>
        <button className="btn btn-primary" onClick={save}>{editing ? "Salvar medicamento" : "Cadastrar medicamento"}</button>
        {editing && <button className="btn" onClick={() => edit()}>Cancelar edição</button>}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {data.medications.map((medication) => (
          <div key={medication.id} className="space-y-2">
            <TheoryMedicationCard medication={medication} onStudy={() => undefined} onTriage={() => actions.navigate("triage", { patientId: data.patients.find((patient) => patient.name === medication.topic)?.id })} />
            <div className="flex gap-2">
              <button className="btn flex-1" onClick={() => edit(medication)}>Editar</button>
              <button className="btn flex-1 border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={() => {
                actions.setData((current) => ({ ...current, medications: current.medications.filter((item) => item.id !== medication.id) }));
                if (userId) theoryService.delete(userId, medication.id).catch(console.error);
              }}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
