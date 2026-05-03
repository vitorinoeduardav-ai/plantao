import { supabase } from "../lib/supabaseClient";
import { Patient, PatientStatus, TriageResponse } from "../types";
import { calculateCureIndex } from "../utils/calculateCureIndex";
import { classifyPatient } from "../utils/classifyPatient";
import { nowIso } from "../utils/dateUtils";
import { scheduleNextReview } from "../utils/scheduleNextReview";
import { attemptService } from "./attemptService";
import { patientFromRow, patientToRow } from "./mappers";

export const patientService = {
  async create(userId: string, patient: Partial<Patient>) {
    const { data, error } = await supabase.from("patients").insert(patientToRow({ ...patient, updatedAt: nowIso() }, userId)).select().single();
    if (error) throw error;
    return patientFromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).order("created_at");
    if (error) throw error;
    return (data || []).map(patientFromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return patientFromRow(data);
  },
  async update(userId: string, id: string, patient: Partial<Patient>) {
    const { data, error } = await supabase.from("patients").update(patientToRow({ ...patient, updatedAt: nowIso() }, userId)).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return patientFromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("patients").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
  async getPatientsDueForReview(userId: string) {
    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).lte("next_review_at", nowIso()).order("next_review_at");
    if (error) throw error;
    return (data || []).map(patientFromRow);
  },
  async getPatientsByStatus(userId: string, status: PatientStatus) {
    const { data, error } = await supabase.from("patients").select("*").eq("user_id", userId).eq("status", status);
    if (error) throw error;
    return (data || []).map(patientFromRow);
  },
  async updatePatientAfterTriage(userId: string, patient: Patient, responses: TriageResponse[], examMode: boolean) {
    const cureIndex = calculateCureIndex(responses);
    const newStatus = classifyPatient(cureIndex, patient.status);
    const nextReviewAt = scheduleNextReview(newStatus, examMode ? "exam" : "normal", patient.dischargeReviewStep || 0).toISOString();
    const updated = await this.update(userId, patient.id, {
      status: newStatus,
      cureIndex,
      hearts: Math.min(3, patient.hearts + (cureIndex >= 80 ? 1 : 0)),
      attempts: patient.attempts + 1,
      consecutiveGreen: newStatus === "green" || newStatus === "discharged" ? patient.consecutiveGreen + 1 : 0,
      nextReviewAt,
      lastReviewAt: nowIso(),
    });
    await attemptService.create(userId, {
      patientId: patient.id,
      responses,
      cureIndex,
      previousStatus: patient.status,
      newStatus,
      notes: responses.some((response) => response.isCorrect && response.confidence === 1) ? "Acertos com baixa confiança indicam revisão." : undefined,
    });
    return updated;
  },
};
