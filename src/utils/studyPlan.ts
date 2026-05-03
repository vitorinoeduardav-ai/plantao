import { AppSettings, DailyStudyPlanItem, Exam, Patient, PatientAttempt } from "../types";
import { getTimeRemaining } from "./dateUtils";

export function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${date}T00:00:00`);
  return Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
}

export function getExamStatus(date: string) {
  const days = daysUntil(date);
  if (days < 0) return { label: "prova passada", className: "border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100" };
  if (days <= 1) return { label: "prova amanhã", className: "border-red-500 bg-red-50 text-red-950 dark:bg-red-950/60 dark:text-red-100" };
  if (days <= 3) return { label: "até 3 dias", className: "border-orange-500 bg-orange-50 text-orange-950 dark:bg-orange-950/60 dark:text-orange-100" };
  if (days <= 7) return { label: "esta semana", className: "border-amber-400 bg-amber-50 text-amber-950 dark:bg-amber-950/60 dark:text-amber-100" };
  if (days <= 14) return { label: "prova próxima", className: "border-sky-500 bg-sky-50 text-sky-950 dark:bg-sky-950/60 dark:text-sky-100" };
  return { label: "prova distante", className: "border-emerald-500 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100" };
}

export function calculateStudyPriority(patient: Patient, exam: Exam, topicWeight: number, daysUntilExam: number, attempts: PatientAttempt[] = []) {
  let score = daysUntilExam <= 1 ? 100 : daysUntilExam <= 3 ? 80 : daysUntilExam <= 7 ? 60 : daysUntilExam <= 14 ? 40 : 20;
  score += topicWeight * 10;
  score += patient.status === "red" ? 50 : patient.status === "orange" ? 35 : patient.status === "yellow" ? 20 : patient.status === "green" ? 5 : patient.status === "not_triaged" ? 30 : patient.status === "ghost" ? 45 : patient.status === "discharged" ? -10 : 0;
  score += (100 - patient.cureIndex) * 0.5;
  if (patient.hearts === 1) score += 30;
  if (patient.hearts === 2) score += 15;
  if (patient.nextReviewAt && getTimeRemaining(patient.nextReviewAt).expired) score += 40;
  const patientAttempts = attempts.filter((attempt) => attempt.patientId === patient.id);
  const wrong = patientAttempts.flatMap((attempt) => attempt.responses).filter((response) => !response.isCorrect);
  const highConfidenceWrong = wrong.filter((response) => response.confidence === 4);
  score += wrong.length * 3 + highConfidenceWrong.length * 8;
  score += exam.priority === "urgent" ? 25 : exam.priority === "high" ? 15 : exam.priority === "medium" ? 5 : 0;
  return Math.round(score);
}

export function generateStudyPlan(exams: Exam[], patients: Patient[], attempts: PatientAttempt[], settings: AppSettings): DailyStudyPlanItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const plan: DailyStudyPlanItem[] = [];

  exams.filter((exam) => daysUntil(exam.date) >= 0).forEach((exam) => {
    const days = Math.max(0, daysUntil(exam.date));
    const ranked = exam.topics
      .map((topic) => {
        const patient = patients.find((item) => item.id === topic.patientId) || patients.find((item) => item.name === topic.topicName);
        if (!patient) return null;
        return { topic, patient, score: calculateStudyPriority(patient, exam, topic.weight, days, attempts) };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => b.score - a.score);

    const availableDays = Math.max(1, Math.min(days || 1, 14));
    ranked.forEach((item, index) => {
      const date = new Date(today);
      const offset = days <= 1 ? 0 : days <= 3 ? Math.min(index % 2, days - 1) : index % Math.max(1, availableDays - 1);
      date.setDate(today.getDate() + offset);
      const actionType =
        days <= 1 ? (item.patient.status === "red" ? "study_theory" : "final_review")
        : days <= 3 ? (item.patient.status === "red" || item.patient.status === "orange" ? "questions" : "review")
        : item.patient.status === "not_triaged" ? "triage"
        : item.patient.status === "red" ? "study_theory"
        : index % 3 === 0 ? "questions"
        : "review";
      plan.push({
        id: `plan-${exam.id}-${item.patient.id}-${date.toISOString().slice(0, 10)}-${index}`,
        date: date.toISOString().slice(0, 10),
        examId: exam.id,
        patientId: item.patient.id,
        topicName: item.topic.topicName,
        subject: item.topic.subject,
        actionType,
        reason: buildReason(exam, item.patient, item.topic.weight, days, actionType, settings.examMode),
        priorityScore: item.score,
        completed: false,
      });
    });

    if (days >= 1 && ranked.length) {
      const finalDate = new Date(`${exam.date}T00:00:00`);
      finalDate.setDate(finalDate.getDate() - 1);
      ranked.slice(0, 4).forEach((item, index) => {
        plan.push({
          id: `final-${exam.id}-${item.patient.id}-${index}`,
          date: finalDate.toISOString().slice(0, 10),
          examId: exam.id,
          patientId: item.patient.id,
          topicName: item.topic.topicName,
          subject: item.topic.subject,
          actionType: "final_review",
          reason: `Revisão final antes de ${exam.title}; tema peso ${item.topic.weight}/5 e cura atual ${item.patient.cureIndex}%.`,
          priorityScore: item.score + 15,
          completed: false,
        });
      });
    }
  });

  return plan.sort((a, b) => a.date.localeCompare(b.date) || b.priorityScore - a.priorityScore).slice(0, 120);
}

function buildReason(exam: Exam, patient: Patient, weight: number, days: number, action: DailyStudyPlanItem["actionType"], examMode: boolean) {
  const actionText = action === "triage" ? "ainda precisa de triagem" : action === "study_theory" ? "precisa de teoria dirigida" : action === "questions" ? "precisa de questões" : action === "final_review" ? "pede revisão final" : "pede revisão";
  const urgency = days <= 1 ? "amanhã" : days <= 3 ? `em ${days} dias` : days <= 7 ? "esta semana" : `em ${days} dias`;
  return `${exam.title} é ${urgency}; ${patient.name} ${actionText}, está em ${patient.status}, tem cura ${patient.cureIndex}% e peso ${weight}/5.${examMode ? " Modo Prova Próxima ativo." : ""}`;
}
