import { supabase } from "../lib/supabaseClient";
import { Exam } from "../types";
import { nowIso } from "../utils/dateUtils";

function fromRow(row: Record<string, unknown>): Exam {
  return {
    id: String(row.id),
    title: String(row.title),
    subject: String(row.subject),
    date: String(row.date),
    description: row.description ? String(row.description) : "",
    priority: (row.priority as Exam["priority"]) || "medium",
    topics: Array.isArray(row.topics) ? row.topics as Exam["topics"] : [],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function toRow(userId: string, exam: Partial<Exam>) {
  return {
    user_id: userId,
    title: exam.title,
    subject: exam.subject,
    date: exam.date,
    description: exam.description,
    priority: exam.priority || "medium",
    topics: exam.topics || [],
    updated_at: nowIso(),
  };
}

export const examService = {
  async create(userId: string, exam: Partial<Exam>) {
    const { data, error } = await supabase.from("exams").insert(toRow(userId, exam)).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("exams").select("*").eq("user_id", userId).order("date");
    if (error) throw error;
    return (data || []).map(fromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("exams").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return fromRow(data);
  },
  async update(userId: string, id: string, exam: Partial<Exam>) {
    const { data, error } = await supabase.from("exams").update(toRow(userId, exam)).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return fromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("exams").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
};
