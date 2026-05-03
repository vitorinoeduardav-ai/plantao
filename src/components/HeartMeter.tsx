import { Heart } from "lucide-react";

export function HeartMeter({ hearts }: { hearts: number }) {
  return (
    <div className="flex items-center gap-1" title={`${hearts} corações`}>
      {[0, 1, 2].map((heart) => (
        <Heart key={heart} size={16} className={heart < hearts ? "fill-rose-500 text-rose-500" : "text-slate-300 dark:text-slate-600"} />
      ))}
    </div>
  );
}
