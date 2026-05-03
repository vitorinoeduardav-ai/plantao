import { supabase } from "../lib/supabaseClient";
import { AppSettings } from "../types";
import { defaultSettings } from "../utils/storage";
import { settingsFromRow, settingsToRow } from "./mappers";

export const settingsService = {
  async create(userId: string, settings: Partial<AppSettings>) {
    const { data, error } = await supabase.from("app_settings").insert(settingsToRow({ ...defaultSettings, ...settings }, userId)).select().single();
    if (error) throw error;
    return settingsFromRow(data);
  },
  async getAll(userId: string) {
    const { data, error } = await supabase.from("app_settings").select("*").eq("user_id", userId);
    if (error) throw error;
    return (data || []).map(settingsFromRow);
  },
  async getById(userId: string, id: string) {
    const { data, error } = await supabase.from("app_settings").select("*").eq("user_id", userId).eq("id", id).single();
    if (error) throw error;
    return settingsFromRow(data);
  },
  async getForUser(userId: string) {
    const { data, error } = await supabase.from("app_settings").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data ? settingsFromRow(data) : this.create(userId, defaultSettings);
  },
  async update(userId: string, _id: string, settings: Partial<AppSettings>) {
    const { data, error } = await supabase.from("app_settings").upsert(settingsToRow(settings, userId), { onConflict: "user_id" }).select().single();
    if (error) throw error;
    return settingsFromRow(data);
  },
  async delete(userId: string, id: string) {
    const { error } = await supabase.from("app_settings").delete().eq("user_id", userId).eq("id", id);
    if (error) throw error;
  },
};
