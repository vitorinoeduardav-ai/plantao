import { Scissors } from "lucide-react";

export function AlternativeList({
  alternatives,
  selected,
  crossed,
  locked,
  correctAnswer,
  onSelect,
  onToggleCross,
}: {
  alternatives: string[];
  selected: string;
  crossed: string[];
  locked?: boolean;
  correctAnswer?: string;
  onSelect: (answer: string) => void;
  onToggleCross: (answer: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {alternatives.map((alternative) => {
        const isSelected = selected === alternative;
        const isCrossed = crossed.includes(alternative);
        const isCorrect = locked && correctAnswer === alternative;
        return (
          <div key={alternative} className={`flex items-center gap-2 rounded-md border p-2 ${isCorrect ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : isSelected ? "border-teal-400 bg-teal-50 dark:border-teal-700 dark:bg-teal-950" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}>
            <button disabled={locked} onClick={() => onSelect(alternative)} className={`flex-1 text-left text-sm ${isCrossed ? "text-slate-400 line-through" : ""}`}>{alternative}</button>
            <button disabled={locked} className="btn p-2" onClick={() => onToggleCross(alternative)} title="Riscar alternativa"><Scissors size={15} /></button>
          </div>
        );
      })}
    </div>
  );
}
