import { ClipboardList, Pill } from "lucide-react";
import { TheoryMedication } from "../types";
import { StoredImage } from "./StoredImage";

export function TheoryMedicationCard({ medication, onStudy, onTriage }: { medication: TheoryMedication; onStudy: () => void; onTriage: () => void }) {
  return (
    <article className="panel">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-200"><Pill size={20} /></span>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">{medication.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{medication.subject} • {medication.topic}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{medication.summary}</p>
      {medication.image && <StoredImage image={medication.image} />}
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <InfoList title="Fórmulas principais" items={medication.formulas} />
        <InfoList title="Quando usar" items={medication.whenToUse} />
        <InfoList title="Erros comuns" items={medication.commonMistakes} />
        <div className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
          <p className="label mb-1">Exemplo resolvido</p>
          {medication.solvedExample}
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {medication.flashcards.map((card) => (
          <details key={card.front} className="rounded-md border border-slate-200 p-3 text-sm dark:border-slate-700">
            <summary className="cursor-pointer font-bold">{card.front}</summary>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{card.back}</p>
          </details>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={onStudy}><Pill size={16} /> Marcar como estudado</button>
        <button className="btn" onClick={onTriage}><ClipboardList size={16} /> Fazer triagem desse tema</button>
      </div>
    </article>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">
      <p className="label mb-2">{title}</p>
      {items.length ? <ul className="space-y-1">{items.map((item) => <li key={item}>• {item}</li>)}</ul> : <p className="text-slate-500">Opcional.</p>}
    </div>
  );
}
