import { useMemo, useState } from "react";
import { AppActions } from "../App";
import { TheoryMedicationCard } from "../components/TheoryMedicationCard";
import { AppData } from "../types";
import { nowIso } from "../utils/dateUtils";

export function Pharmacy({ data, actions, initialTopic }: { data: AppData; actions: AppActions; initialTopic?: string; userId?: string }) {
  const [query, setQuery] = useState(initialTopic || "");
  const medications = useMemo(() => data.medications.filter((med) => `${med.title} ${med.topic} ${med.subject}`.toLowerCase().includes(query.toLowerCase())), [data.medications, query]);

  return (
    <div className="space-y-4">
      <div className="panel">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="label">Farmácia</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Medicamentos para estudar antes da próxima rodada</h2>
          </div>
          <button className="btn" onClick={() => actions.navigate("study-shift")}>Continuar plantão</button>
        </div>
        <input className="field mt-4" placeholder="Buscar medicamento por tema, matéria ou título" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {medications.map((medication) => (
          <TheoryMedicationCard
            key={medication.id}
            medication={medication}
            onStudy={() => actions.setData((current) => ({ ...current, medications: current.medications.map((item) => item.id === medication.id ? { ...item, studiedAt: nowIso() } : item) }))}
            onTriage={() => {
              const patient = data.patients.find((item) => item.name === medication.topic || item.name.includes(medication.topic));
              actions.navigate("triage", { patientId: patient?.id });
            }}
          />
        ))}
      </div>
    </div>
  );
}
