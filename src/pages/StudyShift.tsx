import { AppActions } from "../App";
import { EmptyState } from "../components/EmptyState";
import { PatientCard } from "../components/PatientCard";
import { AppData, Patient } from "../types";
import { getTimeRemaining } from "../utils/dateUtils";
import { getWardTheme } from "../utils/getWardTheme";
import { WardIcon } from "../components/WardIcon";

function priority(patient: Patient) {
  const due = patient.nextReviewAt ? getTimeRemaining(patient.nextReviewAt).expired : false;
  if (patient.status === "red" && due) return { score: 1, reason: "está na ala vermelha e a revisão já venceu." };
  if (patient.status === "orange" && due) return { score: 2, reason: "está na ala laranja e a revisão já venceu." };
  if (patient.status === "yellow" && due) return { score: 3, reason: "está na ala amarela e a revisão já venceu." };
  if (patient.status === "ghost") return { score: 4, reason: "virou fantasma e precisa voltar para a triagem." };
  if (patient.status === "not_triaged") return { score: 5, reason: "ainda não passou pela triagem inicial." };
  if (patient.status === "green") return { score: 6, reason: "está verde e precisa confirmar domínio." };
  if (patient.status === "discharged" && due) return { score: 7, reason: "recebeu alta e voltou para revisão espaçada." };
  return { score: 99, reason: "está aguardando o momento certo." };
}

export function StudyShift({ data, actions }: { data: AppData; actions: AppActions }) {
  const queue = [...data.patients].sort((a, b) => priority(a).score - priority(b).score);
  const recommended = queue[0];
  if (!recommended) return <EmptyState title="Plantão tranquilo" description="Nenhum paciente cadastrado ainda." />;
  const reason = priority(recommended).reason;
  const theme = getWardTheme(recommended.status);

  return (
    <div className="space-y-5">
      <div className={`rounded-lg border-2 p-5 ${theme.backgroundClass} ${theme.borderClass}`}>
        <div className={`flex items-center gap-2 ${theme.textClass}`}>
          <WardIcon iconName={theme.iconName} size={22} />
          <p className="label">Paciente prioritário</p>
        </div>
        <h2 className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{recommended.name}</h2>
        <p className="mt-2 text-slate-700 dark:text-slate-200">Motivo: {reason}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => actions.navigate("triage", { patientId: recommended.id })}>Atender agora</button>
          <button className="btn" onClick={() => actions.navigate("pharmacy", { medicationTopic: recommended.name })}>Ver medicamento antes</button>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-lg font-black text-slate-900 dark:text-white">Próximos da fila</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {queue.slice(1, 7).map((patient) => <PatientCard key={patient.id} patient={patient} onTriage={() => actions.navigate("triage", { patientId: patient.id })} onRecord={() => actions.navigate("patient-record", { patientId: patient.id })} onMedication={() => actions.navigate("pharmacy", { medicationTopic: patient.name })} />)}
        </div>
      </div>
    </div>
  );
}
