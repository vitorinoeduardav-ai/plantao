import { ImagePlus, Trash2 } from "lucide-react";
import { QuestionImage } from "../types";
import { saveImageBlob } from "../utils/imageStorage";
import { imageUploadService } from "../services/imageUploadService";
import { StoredImage } from "./StoredImage";

export function ImageUploader({ label, value, onChange, userId, kind = "question" }: { label: string; value?: QuestionImage; onChange: (image?: QuestionImage) => void; userId?: string; kind?: "question" | "explanation" | "medication" | "avatar" }) {
  async function onFile(file?: File) {
    if (!file) return;
    if (userId) {
      const path =
        kind === "explanation"
          ? await imageUploadService.uploadExplanationImage(userId, file)
          : kind === "medication"
            ? await imageUploadService.uploadMedicationImage(userId, file)
            : kind === "avatar"
              ? await imageUploadService.uploadPatientAvatar(userId, file)
              : await imageUploadService.uploadQuestionImage(userId, file);
      onChange({ id: path, src: path, alt: file.name, caption: "" });
      return;
    }
    const id = `img-${crypto.randomUUID()}`;
    await saveImageBlob(id, file);
    onChange({ id, src: `indexeddb://${id}`, alt: file.name, caption: "" });
  }

  return (
    <div className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <p className="label mb-2">{label}</p>
      {value?.src.startsWith("avatar://") ? (
        <div className="rounded-md bg-teal-50 p-3 text-sm font-bold text-teal-800 dark:bg-teal-950 dark:text-teal-100">Avatar da galeria selecionado.</div>
      ) : value ? <StoredImage image={value} /> : null}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <label className="btn cursor-pointer">
          <ImagePlus size={16} /> Upload
          <input type="file" accept="image/*" className="hidden" onChange={(event) => onFile(event.target.files?.[0])} />
        </label>
        <input className="field sm:col-span-2" placeholder="Legenda" value={value?.caption || ""} onChange={(event) => value && onChange({ ...value, caption: event.target.value })} />
        <input className="field sm:col-span-2" placeholder="Texto alternativo" value={value?.alt || ""} onChange={(event) => value && onChange({ ...value, alt: event.target.value })} />
        {value && <button className="btn border-rose-200 text-rose-700 dark:border-rose-800 dark:text-rose-300" onClick={() => onChange(undefined)}><Trash2 size={16} /> Remover</button>}
      </div>
    </div>
  );
}
