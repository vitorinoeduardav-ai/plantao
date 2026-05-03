import { supabase } from "../lib/supabaseClient";
import { DailyStudyPlanItem } from "../types";
import { nowIso } from "../utils/dateUtils";

function fromRow(row: Record<string, unknown>): DailyStudyPlanItem {
  return {
    id: String(row.id),
    date: String(row.date),
    examId: String(row.exam_id),
    patientId: String(row.patient_id),
    topicName: String(row.topic_name),
    subject: String(row.subject),
    actionType: row.action_type as DailyStudyPlanItem["actionType"],
    reason: String(row.reason || ""),
    priorityScore: Number(row.priority_score || 0),
    completed: Boolean(row.completed),
  };
}

function toRow(userId: string, item: Partial<DailyStudyPlanItem>) {
  return {
    user_id: userId,
    exam_id: item.examId,
    patient_id: item.patientId,
    date: item.date,
    topic_name: item.topicName,
    subject: item.subject,
    action_type: item.actionType,
    reason: item.reason,
    priority_score: item.priorityScore,
    completed: item.completed,
    updated_at: nowIso(),
  };
}

export const studyPlanService = {
  async create(userId: string, item: Partial<DailyStudyPlanItem>) {
    const { data, error } = await supabase.from("daily_study_plan").insert(toRow(userId, item)).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("daily_study_plan").select("*").eq("user_id", userId).order("date");
    if (error) throw error;
    return (data || []).map(fromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("daily_study_plan").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return fromRow(data);
  },
  async update(userId: string, id: string, item: Partial<DailyStudyPlanItem>) {
    const { data, error } = await supabase.from("daily_study_plan").update(toRow(userId, item)).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("daily_study_plan").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
  async replaceAll(userId: string, items: DailyStudyPlanItem[]) {
    await supabase.from("daily_study_plan").delete().eq("user_id", userId);
    if (!items.length) return [];
    const { data, error } = await supabase.from("daily_study_plan").insert(items.map((item) => toRow(userId, item))).select();
    if (error) throw error;
    return (data || []).map(fromRow);
  },
};
