import { AppActions } from "../App";
import { EmptyState } from "../components/EmptyState";
import { PatientCard } from "../components/PatientCard";
import { AppData } from "../types";
import { getTimeRemaining } from "../utils/dateUtils";

export function Reviews({ data, actions }: { data: AppData; actions: AppActions }) {
  const due = data.patients.filter((patient) => patient.nextReviewAt && getTimeRemaining(patient.nextReviewAt).expired);
  const sleeping = data.patients.filter((patient) => patient.nextReviewAt && !getTimeRemaining(patient.nextReviewAt).expired);

  return (
    <div className="space-y-5">
      <section>
        <h2 className="mb-3 text-xl font-black text-slate-900 dark:text-white">Revisões do dia</h2>
        {due.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{due.map((patient) => <PatientCard key={patient.id} patient={patient} onTriage={() => actions.navigate("triage", { patientId: patient.id })} onRecord={() => actions.navigate("patient-record", { patientId: patient.id })} onMedication={() => actions.navigate("pharmacy", { medicationTopic: patient.name })} />)}</div> : <EmptyState title="Nada vencido agora" description="Os pacientes estão em repouso ou ainda não têm retorno marcado." />}
      </section>
      <section>
        <h2 className="mb-3 text-xl font-black text-slate-900 dark:text-white">Em repouso</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{sleeping.slice(0, 9).map((patient) => <PatientCard key={patient.id} patient={patient} onTriage={() => actions.navigate("triage", { patientId: patient.id })} onRecord={() => actions.navigate("patient-record", { patientId: patient.id })} onMedication={() => actions.navigate("pharmacy", { medicationTopic: patient.name })} />)}</div>
      </section>
    </div>
  );
}
