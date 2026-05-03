import { Exam, Patient, PatientAttempt } from "../types";
import { getTimeRemaining } from "./dateUtils";
import { calculateStudyPriority, daysUntil } from "./studyPlan";

export type StudyRecommendation = {
  id: string;
  patientId?: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low" | "calm";
  colorClass: string;
  actionLabel: string;
  route: "triage" | "pharmacy" | "registration-center" | "study-shift" | "patient-record" | "treatment-plan";
};

export function getStudyRecommendations(
  patients: Patient[],
  attempts: PatientAttempt[] = [],
  reviews: Patient[] = [],
  exams: Exam[] = [],
): StudyRecommendation[] {
  const recommendations: StudyRecommendation[] = [];
  const due = (patient: Patient) => patient.nextReviewAt ? getTimeRemaining(patient.nextReviewAt).expired : false;
  const pushPatient = (
    patient: Patient,
    priority: StudyRecommendation["priority"],
    title: string,
    description: string,
    actionLabel = "Atender agora",
    route: StudyRecommendation["route"] = "triage",
  ) => {
    recommendations.push({
      id: `${patient.id}-${priority}-${recommendations.length}`,
      patientId: patient.id,
      title,
      description,
      priority,
      colorClass:
        priority === "critical" ? "border-red-500 bg-red-50 text-red-950 dark:bg-red-950/60 dark:text-red-100"
        : priority === "high" ? "border-orange-500 bg-orange-50 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100"
        : priority === "medium" ? "border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100"
        : priority === "low" ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100"
        : "border-slate-300 bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100",
      actionLabel,
      route,
    });
  };

  const economyTomorrow = exams.find((exam) => exam.subject === "Economia" && daysUntil(exam.date) <= 1 && daysUntil(exam.date) >= 0);
  if (economyTomorrow) {
    const getPatient = (name: string) => patients.find((patient) => patient.subject === "Economia" && patient.name === name);
    const custom = [
      {
        patient: getPatient("Inflação"),
        title: "Prioridade máxima: Economia",
        description: "Sua prova de Economia é amanhã. Comece por Inflação, Tipos de inflação e Política monetária.",
        actionLabel: "Começar plano de hoje",
        route: "treatment-plan" as const,
        priority: "critical" as const,
      },
      {
        patient: getPatient("PIB"),
        title: "Revise PIB antes da prova",
        description: "PIB tem fórmula provável de cair: PIB = C + G + I + X - M. Faça questões desse tema.",
        actionLabel: "Estudar PIB",
        route: "pharmacy" as const,
        priority: "high" as const,
      },
      {
        patient: getPatient("Elasticidade"),
        title: "Faça questões de Elasticidade",
        description: "Elasticidade costuma misturar conceito e cálculo. Resolva pelo menos 5 questões antes da revisão final.",
        actionLabel: "Fazer questões",
        route: "triage" as const,
        priority: "high" as const,
      },
      {
        patient: patients.find((patient) => patient.subject === "Economia" && (patient.status === "red" || patient.status === "orange")),
        title: "Não comece tema novo sem revisar os graves",
        description: "Como a prova é amanhã, priorize pacientes vermelhos, laranja e temas com menor índice de cura.",
        actionLabel: "Ver plantão",
        route: "study-shift" as const,
        priority: "medium" as const,
      },
    ];
    custom.forEach((item) => {
      recommendations.push({
        id: `economy-exam-${item.title}`,
        patientId: item.patient?.id,
        title: item.title,
        description: item.description,
        priority: item.priority,
        colorClass: item.priority === "critical" ? "border-red-500 bg-red-50 text-red-950 dark:bg-red-950/60 dark:text-red-100" : item.priority === "high" ? "border-orange-500 bg-orange-50 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100" : "border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100",
        actionLabel: item.actionLabel,
        route: item.route,
      });
    });
  }

  exams
    .filter((exam) => daysUntil(exam.date) >= 0)
    .flatMap((exam) => exam.topics.map((topic) => {
      const patient = patients.find((item) => item.id === topic.patientId) || patients.find((item) => item.name === topic.topicName);
      if (!patient) return null;
      return { exam, topic, patient, days: daysUntil(exam.date), score: calculateStudyPriority(patient, exam, topic.weight, daysUntil(exam.date), attempts) };
    }))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => b.score - a.score)
    .filter(({ exam }) => exam.id !== economyTomorrow?.id)
    .slice(0, 3)
    .forEach(({ exam, topic, patient, days, score }) => {
      const priority: StudyRecommendation["priority"] = days <= 1 ? "critical" : days <= 3 ? "high" : days <= 7 ? "medium" : "low";
      const title = days <= 1
        ? `${exam.subject} é prioridade máxima`
        : `${exam.subject} está próxima`;
      const description = days <= 1
        ? `Sua prova é amanhã. Revise ${topic.topicName} antes de iniciar novos temas.`
        : patient.status === "not_triaged"
          ? `${topic.topicName} cai em ${exam.title} e ainda não passou pela recepção. Faça a triagem hoje.`
          : `${topic.topicName} tem peso ${topic.weight}/5, prioridade ${score}, e está na ala ${patient.status}.`;
      pushPatient(patient, priority, title, description, patient.status === "red" ? "Estudar teoria" : "Começar agora", patient.status === "red" ? "pharmacy" : "triage");
    });

  patients.filter((patient) => patient.status === "red" && due(patient)).slice(0, 2).forEach((patient) =>
    pushPatient(patient, "critical", `Atenda primeiro ${patient.name}`, "Paciente na ala vermelha com revisão urgente."),
  );
  patients.filter((patient) => patient.status === "orange" && due(patient)).slice(0, 2).forEach((patient) =>
    pushPatient(patient, "high", `${patient.name} precisa de revisão`, "Paciente laranja com lacunas importantes e retorno vencido."),
  );
  patients.filter((patient) => patient.status === "yellow" && due(patient)).slice(0, 2).forEach((patient) =>
    pushPatient(patient, "medium", `Revise ${patient.name}`, "Paciente amarelo com revisão vencida. Foque nos erros recentes."),
  );
  patients.filter((patient) => patient.hearts <= 1 && patient.status !== "ghost").slice(0, 2).forEach((patient) =>
    pushPatient(patient, "critical", `${patient.name} está com poucos corações`, "Revise agora para reduzir o risco de virar fantasma."),
  );
  patients.filter((patient) => patient.status === "not_triaged").slice(0, 2).forEach((patient) =>
    pushPatient(patient, "low", `Há pacientes aguardando na recepção`, `Inicie a triagem de ${patient.name}.`),
  );
  patients.filter((patient) => patient.status === "ghost").slice(0, 2).forEach((patient) =>
    pushPatient(patient, "high", `${patient.name} virou fantasma`, "Esse paciente precisa voltar para a triagem inicial."),
  );
  patients.filter((patient) => patient.status === "green").slice(0, 2).forEach((patient) =>
    pushPatient(patient, "low", `${patient.name} está estável`, "Confirme o domínio em uma próxima rodada.", "Ver prontuário", "patient-record"),
  );

  if (!recommendations.length) {
    recommendations.push({
      id: "calm",
      title: exams.length ? "As provas próximas estão controladas" : attempts.length || reviews.length ? "O plantão está estável" : "Comece seu primeiro atendimento",
      description: exams.length ? "Continue revisando pacientes amarelos e verdes enquanto mantém o plano em dia." : attempts.length || reviews.length ? "Você pode iniciar um novo paciente ou estudar um medicamento leve." : "Há pacientes prontos para a primeira triagem.",
      priority: "calm",
      colorClass: "border-teal-400 bg-teal-50 text-teal-950 dark:bg-teal-950/60 dark:text-teal-100",
      actionLabel: "Abrir plantão",
      route: "study-shift",
    });
  }

  return recommendations.slice(0, 5);
}
