import { AppActions } from "../App";
import { PatientCard } from "../components/PatientCard";
import { WardIcon } from "../components/WardIcon";
import { AppData, PatientStatus } from "../types";
import { getWardTheme } from "../utils/getWardTheme";

const wards: PatientStatus[] = ["red", "orange", "yellow", "green", "discharged", "ghost"];

export function Wards({ data, actions }: { data: AppData; actions: AppActions }) {
  return (
    <div className="space-y-5">
      <div className="panel">
        <p className="label">Mapa do hospital</p>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Alas de estudo</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Veja onde cada paciente está e escolha a próxima ação de estudo.</p>
      </div>
      <div className="grid gap-5">
        {wards.map((ward) => {
          const theme = getWardTheme(ward);
          const patients = data.patients.filter((patient) => patient.status === ward);
          return (
            <section key={ward} className={`rounded-lg border-2 p-4 ${theme.backgroundClass} ${theme.borderClass}`}>
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className={theme.textClass}>
                  <div className="flex items-center gap-2">
                    <WardIcon iconName={theme.iconName} size={22} />
                    <h3 className="text-xl font-black">{theme.label}</h3>
                  </div>
                  <p className="mt-1 text-sm opacity-80">{theme.description}</p>
                </div>
                <span className={`rounded-full border px-3 py-1 text-sm font-black ${theme.badgeClass}`}>{patients.length} paciente(s)</span>
              </div>
              {patients.length ? (
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
              ) : (
                <div className="rounded-lg border border-dashed border-current p-4 text-sm opacity-70">Nenhum paciente nesta ala.</div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
