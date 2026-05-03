import { Download, RotateCcw, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { AppActions } from "../App";
import { AppData } from "../types";
import { clearImages } from "../utils/imageStorage";
import { downloadJson, parseBackup } from "../utils/importExport";

export function Settings({ data, actions }: { data: AppData; actions: AppActions }) {
  const [backup, setBackup] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <div className="panel grid gap-3 md:grid-cols-2">
        <label><span className="label">Nome da estudante</span><input className="field mt-1" value={data.settings.studentName || ""} onChange={(event) => actions.setData((current) => ({ ...current, settings: { ...current.settings, studentName: event.target.value } }))} /></label>
        <label><span className="label">Nome do app</span><input className="field mt-1" value={data.settings.appName} onChange={(event) => actions.setData((current) => ({ ...current, settings: { ...current.settings, appName: event.target.value } }))} /></label>
        <label className="btn justify-start"><input type="checkbox" checked={data.settings.darkMode} onChange={(event) => actions.setData((current) => ({ ...current, settings: { ...current.settings, darkMode: event.target.checked } }))} /> Modo escuro</label>
        <label className="btn justify-start"><input type="checkbox" checked={data.settings.examMode} onChange={(event) => actions.setData((current) => ({ ...current, settings: { ...current.settings, examMode: event.target.checked } }))} /> Modo Prova Próxima</label>
      </div>
      <div className="panel">
        <p className="label mb-3">Backup e limpeza</p>
        <div className="flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => downloadJson("backup-plantao-da-engenharia.json", data)}><Download size={16} /> Exportar backup</button>
          <button className="btn" onClick={() => downloadJson("questoes-plantao-da-engenharia.json", data.questions)}><Download size={16} /> Exportar questões</button>
          <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={() => window.confirm("Resetar todo progresso?") && actions.resetAll()}><RotateCcw size={16} /> Resetar progresso</button>
          <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={() => window.confirm("Limpar banco de questões?") && actions.setData((current) => ({ ...current, questions: [] }))}><Trash2 size={16} /> Limpar questões</button>
          <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={async () => { await clearImages(); setMessage("Imagens salvas foram limpas."); }}><Trash2 size={16} /> Limpar imagens</button>
        </div>
      </div>
      <div className="panel">
        <p className="label mb-2">Importar backup completo</p>
        <textarea className="field min-h-40 font-mono text-xs" value={backup} onChange={(event) => setBackup(event.target.value)} placeholder="Cole aqui o JSON exportado do backup." />
        <button className="btn btn-primary mt-3" onClick={() => {
          const parsed = parseBackup(backup);
          if (!parsed) return setMessage("Backup inválido.");
          actions.setData(parsed);
          setMessage("Backup restaurado.");
        }}><Upload size={16} /> Importar backup</button>
        {message && <p className="mt-2 text-sm font-bold text-teal-700 dark:text-teal-300">{message}</p>}
      </div>
    </div>
  );
}
