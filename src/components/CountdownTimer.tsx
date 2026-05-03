import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { getTimeRemaining } from "../utils/dateUtils";

export function CountdownTimer({ nextReviewAt }: { nextReviewAt?: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const remaining = getTimeRemaining(nextReviewAt);
  void tick;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${remaining.expired ? "text-fuchsia-700 dark:text-fuchsia-300" : "text-slate-500 dark:text-slate-400"}`}>
      <Clock size={14} />
      {remaining.label}
    </span>
  );
}
