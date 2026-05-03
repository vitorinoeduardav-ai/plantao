import { supabase } from "../lib/supabaseClient";
import { TheoryMedication } from "../types";
import { nowIso } from "../utils/dateUtils";
import { medicationFromRow, medicationToRow } from "./mappers";

export const theoryService = {
  async create(userId: string, medication: Partial<TheoryMedication>) {
    const { data, error } = await supabase.from("theory_medications").insert(medicationToRow({ ...medication, updatedAt: nowIso() }, userId)).select().single();
    if (error) throw error;
    return medicationFromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("theory_medications").select("*").eq("user_id", userId).order("created_at");
    if (error) throw error;
    return (data || []).map(medicationFromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("theory_medications").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return medicationFromRow(data);
  },
  async update(userId: string, id: string, medication: Partial<TheoryMedication>) {
    const { data, error } = await supabase.from("theory_medications").update(medicationToRow({ ...medication, updatedAt: nowIso() }, userId)).eq("user_id", userId).eq("id", id).select().single();
    if (error) throw error;
    return medicationFromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("theory_medications").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
};
