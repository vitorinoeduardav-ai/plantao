import { supabase } from "../lib/supabaseClient";
import { ImportConflictMode, Question } from "../types";
import { nowIso } from "../utils/dateUtils";
import { validateQuestion } from "../utils/importExport";
import { questionFromRow, questionToRow } from "./mappers";

export const questionService = {
  async create(userId: string, question: Partial<Question>) {
    const { data, error } = await supabase.from("questions").insert(questionToRow({ ...question, updatedAt: nowIso() }, userId)).select().single();
    if (error) throw error;
    return questionFromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("questions").select("*").eq("user_id", userId).order("created_at");
    if (error) throw error;
    return (data || []).map(questionFromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("questions").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return questionFromRow(data);
  },
  async getByTopic(userId: string, topic: string) {
    const { data, error } = await supabase.from("questions").select("*").eq("user_id", userId).eq("topic", topic);
    if (error) throw error;
    return (data || []).map(questionFromRow);
  },
  async update(userId: string, id: string, question: Partial<Question>) {
    const { data, error } = await supabase.from("questions").update(questionToRow({ ...question, updatedAt: nowIso() }, userId)).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return questionFromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("questions").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
  async importQuestionsFromJson(userId: string, questions: Question[], mode: ImportConflictMode) {
    const valid = questions.filter((question, index) => validateQuestion(question, index).length === 0);
    const existing = await this.getAll(userId);
    const existingByLegacyId = new Map(existing.map((question) => [question.id, question]));
    const saved: Question[] = [];
    for (const question of valid) {
      const found = existingByLegacyId.get(question.id);
      if (found && mode === "ignore") continue;
      if (found && mode === "replace") {
        saved.push(await this.update(userId, found.id, question));
      } else {
        const copy = mode === "duplicate" && found ? { ...question, id: undefined } : question;
        saved.push(await this.create(userId, copy));
      }
    }
    return saved;
  },
  async exportQuestionsToJson(userId: string) {
    return JSON.stringify(await this.getAll(userId), null, 2);
  },
};
