import { ReactNode } from "react";

export function StatsCard({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <div className="panel">
      <div className="flex items-center justify-between gap-3">
        <p className="label">{label}</p>
        <span className="text-teal-700 dark:text-teal-300">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
