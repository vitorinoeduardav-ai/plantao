import { supabase } from "../lib/supabaseClient";
import { PatientAttempt } from "../types";
import { attemptFromRow } from "./mappers";

export const attemptService = {
  async create(userId: string, attempt: Partial<PatientAttempt>) {
    const { data, error } = await supabase.from("patient_attempts").insert({
      user_id: userId,
      patient_id: attempt.patientId,
      cure_index: attempt.cureIndex,
      previous_status: attempt.previousStatus,
      new_status: attempt.newStatus,
      responses: attempt.responses || [],
      notes: attempt.notes,
    }).select().single();
    if (error) throw error;
    return attemptFromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("patient_attempts").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(attemptFromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("patient_attempts").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return attemptFromRow(data);
  },
  async update(userId: string, id: string, attempt: Partial<PatientAttempt>) {
    const { data, error } = await supabase.from("patient_attempts").update({
      cure_index: attempt.cureIndex,
      previous_status: attempt.previousStatus,
      new_status: attempt.newStatus,
      responses: attempt.responses,
      notes: attempt.notes,
    }).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return attemptFromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("patient_attempts").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
  async getByPatient(userId: string, patientId: string) {
    const { data, error } = await supabase.from("patient_attempts").select("*").eq("user_id", userId).eq("patient_id", patientId).order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(attemptFromRow);
  },
};
