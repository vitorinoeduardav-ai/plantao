import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";
import { initializeUserData } from "./initializeUserData";

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  if (data.user && data.session) {
    await supabase.from("profiles").upsert({ id: data.user.id, email, name });
    await initializeUserData(data.user.id);
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (data.user) {
    await supabase.from("profiles").upsert({ id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || "" });
    await initializeUserData(data.user.id);
  }
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user;
}
