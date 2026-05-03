import { supabase } from "../lib/supabaseClient";

const BUCKET = "question-images";

function buildPath(userId: string, folder: string, file: File) {
  const safeName = file.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_.-]+/g, "-");
  return `${userId}/${folder}/${crypto.randomUUID()}-${safeName}`;
}

async function upload(userId: string, folder: string, file: File) {
  const path = buildPath(userId, folder, file);
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}

export const imageUploadService = {
  async uploadQuestionImage(userId: string, file: File) {
    return upload(userId, "questions", file);
  },
  async uploadExplanationImage(userId: string, file: File) {
    return upload(userId, "explanations", file);
  },
  async uploadMedicationImage(userId: string, file: File) {
    return upload(userId, "medications", file);
  },
  async uploadPatientAvatar(userId: string, file: File) {
    return upload(userId, "avatars", file);
  },
  async deleteImage(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  },
  getPublicUrl(path: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  },
  async createSignedUrl(path: string, expiresIn = 3600) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
    if (error) throw error;
    return data.signedUrl;
  },
};
