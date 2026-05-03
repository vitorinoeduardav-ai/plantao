import { useMemo, useState } from "react";
import { AppActions } from "../App";
import { PatientCard } from "../components/PatientCard";
import { AppData } from "../types";

export function Reception({ data, actions }: { data: AppData; actions: AppActions }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const subjects = Array.from(new Set(data.patients.map((patient) => patient.subject)));
  const patients = useMemo(() => data.patients.filter((patient) =>
    `${patient.name} ${patient.subject}`.toLowerCase().includes(query.toLowerCase()) &&
    (!subject || patient.subject === subject)
  ), [data.patients, query, subject]);

  return (
    <div className="space-y-5">
      <div className="panel">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="label">Recepção</p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Pacientes disponíveis para atendimento</h2>
          </div>
          <button className="btn" onClick={() => actions.navigate("study-shift")}>Continuar plantão</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_240px]">
          <input className="field" placeholder="Buscar paciente ou matéria" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="field" value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="">Todas as matérias</option>
            {subjects.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onTriage={() => actions.navigate("triage", { patientId: patient.id })}
            onRecord={() => actions.navigate("patient-record", { patientId: patient.id })}
            onMedication={() => actions.navigate("pharmacy", { medicationTopic: patient.name })}
          />
        ))}
      </div>
    </div>
  );
}
