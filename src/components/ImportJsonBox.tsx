import { useState } from "react";

export function ImportJsonBox({ onParse }: { onParse: (json: string) => void }) {
  const [json, setJson] = useState("");

  return (
    <div className="panel">
      <p className="label mb-2">JSON</p>
      <textarea className="field min-h-56 font-mono text-xs" value={json} onChange={(event) => setJson(event.target.value)} placeholder='Cole uma lista JSON de questões aqui: [{"id":"..."}]' />
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => onParse(json)}>Validar JSON</button>
        <label className="btn cursor-pointer">
          Importar arquivo
          <input
            className="hidden"
            type="file"
            accept="application/json,.json"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              setJson(text);
              onParse(text);
            }}
          />
        </label>
      </div>
    </div>
  );
}
