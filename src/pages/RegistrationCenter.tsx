import { BookOpen, CalendarDays, FileInput, ImagePlus, LayoutGrid, Pill, Settings, Tags, UsersRound } from "lucide-react";
import { AppActions } from "../App";
import { AppData } from "../types";

const cards = [
  { title: "Cadastrar Matéria", description: "Crie e organize grandes áreas de estudo, como Física 2, Economia e Cálculo.", page: "patients-admin", icon: Tags },
  { title: "Cadastrar Paciente/Tema", description: "Cadastre os temas que serão tratados no sistema de triagem.", page: "patients-admin", icon: UsersRound },
  { title: "Cadastrar Questão", description: "Crie, edite e organize questões por matéria, tema e dificuldade.", page: "question-editor", icon: BookOpen },
  { title: "Importar Questões por JSON", description: "Importe questões em JSON criadas por assistente ou a partir de fotos.", page: "import-questions", icon: FileInput },
  { title: "Cadastrar Medicamento/Teoria", description: "Cadastre resumos, fórmulas, erros comuns e exemplos resolvidos.", page: "medications-admin", icon: Pill },
  { title: "Cadastrar Imagem/Avatar", description: "Escolha ou envie imagens para representar os pacientes.", page: "patients-admin", icon: ImagePlus },
  { title: "Provas e calendário", description: "Cadastre datas de prova e vincule temas/pacientes que devem entrar na fila de prioridade.", page: "treatment-plan", icon: CalendarDays },
  { title: "Gerenciar Banco de Questões", description: "Revise, edite, duplique, exclua e exporte questões.", page: "question-bank", icon: LayoutGrid },
  { title: "Gerenciar Medicamentos", description: "Edite e remova medicamentos cadastrados.", page: "medications-admin", icon: Pill },
  { title: "Gerenciar Pacientes", description: "Edite temas, matérias, descrições e avatares.", page: "patients-admin", icon: UsersRound },
  { title: "Configurações", description: "Ajuste modo escuro, modo prova próxima, nome do app e backup.", page: "settings", icon: Settings },
] as const;

export function RegistrationCenter({ actions }: { data: AppData; actions: AppActions }) {
  return (
    <div className="space-y-5">
      <section className="panel bg-slate-900 text-white dark:bg-slate-900">
        <p className="text-xs font-black uppercase tracking-[0.08em] text-teal-200">Administração</p>
        <h2 className="mt-2 text-3xl font-black">Central de Cadastro</h2>
        <p className="mt-2 max-w-2xl text-slate-300">Tudo que cria, edita ou organiza conteúdo fica aqui. O plantão diário continua limpo para estudar sem sensação de painel administrativo.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ title, description, page, icon: Icon }) => (
          <button key={title} onClick={() => actions.navigate(page)} className="panel group min-h-44 text-left transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-soft">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-teal-100 text-teal-800 transition group-hover:bg-teal-700 group-hover:text-white dark:bg-teal-950 dark:text-teal-200">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 text-lg font-black text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </button>
        ))}
      </section>
    </div>
  );
}
