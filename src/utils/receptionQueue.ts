import { Exam, Patient, PatientAttempt } from "../types";
import { getTimeRemaining } from "./dateUtils";
import { calculateStudyPriority, daysUntil } from "./studyPlan";

export type ReceptionQueueItem = {
  patient: Patient;
  exam?: Exam;
  topicWeight?: number;
  daysUntilExam?: number;
  priorityScore: number;
  reason: string;
};

const statusRank: Record<string, number> = {
  not_triaged: 0,
  red: 1,
  orange: 2,
  yellow: 3,
  green: 4,
  discharged: 5,
  ghost: 1,
};

export function getReceptionQueue(patients: Patient[], exams: Exam[], attempts: PatientAttempt[] = []) {
  const activeExams = exams.filter((exam) => daysUntil(exam.date) >= 0).sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  const items: ReceptionQueueItem[] = [];

  for (const patient of patients) {
    const links = activeExams
      .map((exam) => {
        const topic = exam.topics.find((item) => item.patientId === patient.id || item.topicName === patient.name);
        if (!topic) return null;
        const days = daysUntil(exam.date);
        return { exam, topic, days, score: calculateStudyPriority(patient, exam, topic.weight, days, attempts) };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.days - b.days || b.topic.weight - a.topic.weight);
    const main = links[0];
    const reviewDue = patient.nextReviewAt ? getTimeRemaining(patient.nextReviewAt).expired : false;
    const baseScore = main ? main.score : 0;
    const score = baseScore
      + (patient.status === "not_triaged" ? 70 : 0)
      + (patient.status === "red" ? 60 : patient.status === "orange" ? 45 : 0)
      + (reviewDue ? 40 : 0)
      + (100 - patient.cureIndex) * 0.2
      - (main ? main.days * 4 : 200);
    items.push({
      patient,
      exam: main?.exam,
      topicWeight: main?.topic.weight,
      daysUntilExam: main?.days,
      priorityScore: Math.round(score),
      reason: main ? `${main.exam.subject} ${main.days <= 1 ? "amanhã" : `em ${main.days} dias`}` : "Sem prova vinculada",
    });
  }

  const sorted = items.sort((a, b) => {
    const examA = a.daysUntilExam ?? 999;
    const examB = b.daysUntilExam ?? 999;
    return examA - examB
      || (b.topicWeight || 0) - (a.topicWeight || 0)
      || statusRank[a.patient.status] - statusRank[b.patient.status]
      || a.patient.cureIndex - b.patient.cureIndex
      || b.priorityScore - a.priorityScore;
  });

  return {
    reception: sorted.filter((item) => item.patient.status === "not_triaged"),
    returns: sorted.filter((item) => item.patient.status !== "not_triaged" && shouldReturn(item)),
    all: sorted,
  };
}

function shouldReturn(item: ReceptionQueueItem) {
  const patient = item.patient;
  const reviewDue = patient.nextReviewAt ? getTimeRemaining(patient.nextReviewAt).expired : false;
  return reviewDue || patient.status === "red" || patient.status === "orange" || patient.cureIndex < 70 || (item.daysUntilExam !== undefined && item.daysUntilExam <= 7);
}
