import { initialPatients } from "../data/initialPatients";
import { initialQuestions } from "../data/initialQuestions";
import { initialTheory } from "../data/initialTheory";
import { supabase } from "../lib/supabaseClient";
import { defaultSettings } from "../utils/storage";
import { patientToRow, questionToRow, medicationToRow, settingsToRow } from "./mappers";

export async function initializeUserData(userId: string) {
  const { count, error } = await supabase.from("patients").select("id", { count: "exact", head: true }).eq("user_id", userId);
  if (error) throw error;
  if ((count || 0) > 0) return;

  const settingsResult = await supabase.from("app_settings").upsert(settingsToRow(defaultSettings, userId), { onConflict: "user_id" });
  if (settingsResult.error) throw settingsResult.error;
  const patientsResult = await supabase.from("patients").insert(initialPatients.map((patient) => {
    const row = patientToRow(patient, userId);
    delete (row as { updated_at?: string }).updated_at;
    return row;
  }));
  if (patientsResult.error) throw patientsResult.error;
  const questionsResult = await supabase.from("questions").insert(initialQuestions.map((question) => {
    const row = questionToRow(question, userId);
    delete (row as { updated_at?: string }).updated_at;
    return row;
  }));
  if (questionsResult.error) throw questionsResult.error;
  const theoryResult = await supabase.from("theory_medications").insert(initialTheory.map((medication) => {
    const row = medicationToRow(medication, userId);
    delete (row as { updated_at?: string }).updated_at;
    return row;
  }));
  if (theoryResult.error) throw theoryResult.error;
}
