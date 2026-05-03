import { Activity, Lock, Mail, UserRound } from "lucide-react";
import { ReactNode } from "react";
import { useState } from "react";
import { signIn, signUp, resetPassword } from "../services/authService";

type AuthMode = "login" | "signup" | "reset";

export function AuthPage({ onOffline, onAuthenticated, supabaseConfigured }: { onOffline: () => void; onAuthenticated: () => void; supabaseConfigured: boolean }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setMessage("");
    try {
      if (mode === "login") {
        await signIn(email, password);
        onAuthenticated();
      }
      if (mode === "signup") {
        await signUp(email, password, name);
        setMessage("Cadastro criado. Se a confirmação de email estiver ativa, confirme sua conta antes de entrar.");
        onAuthenticated();
      }
      if (mode === "reset") {
        await resetPassword(email);
        setMessage("Enviamos o link de recuperação para seu email.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível concluir a ação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbf9] px-4 py-8 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="space-y-4">
          <span className="inline-grid h-14 w-14 place-items-center rounded-lg bg-teal-700 text-white"><Activity size={30} /></span>
          <div>
            <p className="label">Clínica de estudos na nuvem</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">Plantão da Engenharia</h1>
          </div>
          <p className="max-w-xl text-slate-600 dark:text-slate-300">Entre para salvar pacientes, questões, medicamentos, prontuários, revisões e imagens na sua conta Supabase.</p>
        </section>
        <section className="panel shadow-soft">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{mode === "login" ? "Entrar" : mode === "signup" ? "Criar conta" : "Recuperar senha"}</h2>
          <div className="mt-4 space-y-3">
            {mode === "signup" && <Field icon={<UserRound size={16} />} placeholder="Nome" value={name} onChange={setName} />}
            <Field icon={<Mail size={16} />} placeholder="Email" value={email} onChange={setEmail} />
            {mode !== "reset" && <Field icon={<Lock size={16} />} placeholder="Senha" type="password" value={password} onChange={setPassword} />}
            <button className="btn btn-primary w-full" disabled={loading || !supabaseConfigured} onClick={submit}>{loading ? "Carregando..." : mode === "login" ? "Entrar" : mode === "signup" ? "Cadastrar" : "Enviar recuperação"}</button>
            {!supabaseConfigured && <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">Supabase ainda não está configurado. Preencha o `.env` para login real ou use o modo offline.</p>}
            {message && <p className="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800">{message}</p>}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <button className="font-bold text-teal-700 dark:text-teal-300" onClick={() => setMode(mode === "login" ? "signup" : "login")}>{mode === "login" ? "Criar conta" : "Já tenho conta"}</button>
            <button className="font-bold text-teal-700 dark:text-teal-300" onClick={() => setMode("reset")}>Esqueci a senha</button>
            <button className="font-bold text-slate-500 dark:text-slate-300" onClick={onOffline}>Usar offline</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ icon, value, onChange, placeholder, type = "text" }: { icon: ReactNode; value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
      <span className="text-slate-400">{icon}</span>
      <input className="w-full bg-transparent text-sm outline-none" type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
