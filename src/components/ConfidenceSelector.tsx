import { TriageResponse } from "../types";

const labels: Record<TriageResponse["confidence"], string> = {
  1: "Chutei",
  2: "Dúvida",
  3: "Quase certeza",
  4: "Certeza total",
};

export function ConfidenceSelector({ value, onChange }: { value: TriageResponse["confidence"]; onChange: (value: TriageResponse["confidence"]) => void }) {
  return (
    <div>
      <p className="label mb-2">Confiança</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {([1, 2, 3, 4] as const).map((level) => (
          <button key={level} className={`btn ${value === level ? "btn-primary" : ""}`} onClick={() => onChange(level)}>{level}. {labels[level]}</button>
        ))}
      </div>
    </div>
  );
}
