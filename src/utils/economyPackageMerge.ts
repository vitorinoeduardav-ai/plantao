import { AppData, DailyStudyPlanItem, Exam, Patient, Question, TheoryMedication } from "../types";
import { buildEconomyExam, buildEconomyIntensivePlan, economyExamMedications, economyExamPatients, economyExamQuestions } from "../data/economyExamPackage";

export function mergeEconomyExamPackage(data: AppData): AppData {
  const patients = mergePatients(data.patients);
  const medications = mergeMedications(data.medications);
  const questions = mergeQuestions(data.questions);
  const exam = buildEconomyExam(patients);
  const exams = upsertExam(data.exams || [], exam);
  const dailyStudyPlan = mergePlan(data.dailyStudyPlan || [], buildEconomyIntensivePlan(exam, patients));
  return { ...data, patients, medications, questions, exams, dailyStudyPlan };
}

function normalize(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function mergePatients(existing: Patient[]) {
  const next = [...existing];
  for (const patient of economyExamPatients) {
    const foundIndex = next.findIndex((item) => item.subject === "Economia" && normalize(item.name) === normalize(patient.name));
    if (foundIndex === -1) {
      next.push(patient);
      continue;
    }
    const found = next[foundIndex];
    next[foundIndex] = {
      ...found,
      description: found.description || patient.description,
      tags: Array.from(new Set([...(found.tags || []), ...(patient.tags || [])])),
      avatarUrl: found.avatarUrl || patient.avatarUrl,
      avatarAlt: found.avatarAlt || patient.avatarAlt,
      avatarStyle: found.avatarStyle || patient.avatarStyle,
      updatedAt: found.updatedAt,
    };
  }
  return next;
}

function mergeMedications(existing: TheoryMedication[]) {
  const next = [...existing];
  for (const med of economyExamMedications) {
    const foundIndex = next.findIndex((item) => item.id === med.id || (item.subject === "Economia" && normalize(item.topic) === normalize(med.topic)));
    if (foundIndex === -1) next.push(med);
    else next[foundIndex] = { ...next[foundIndex], ...med, studiedAt: next[foundIndex].studiedAt };
  }
  return next;
}

function mergeQuestions(existing: Question[]) {
  const byId = new Map(existing.map((question) => [question.id, question]));
  for (const question of economyExamQuestions) {
    if (!byId.has(question.id)) byId.set(question.id, question);
  }
  return Array.from(byId.values());
}

function upsertExam(existing: Exam[], exam: Exam) {
  const found = existing.find((item) => item.id === exam.id || (item.title === exam.title && item.subject === exam.subject));
  if (!found) return [...existing, exam];
  return existing.map((item) => item.id === found.id ? { ...item, ...exam, id: item.id, createdAt: item.createdAt } : item);
}

function mergePlan(existing: DailyStudyPlanItem[], intensive: DailyStudyPlanItem[]) {
  const byId = new Map(existing.map((item) => [item.id, item]));
  for (const item of intensive) {
    const previous = byId.get(item.id);
    byId.set(item.id, previous ? { ...item, completed: previous.completed } : item);
  }
  return Array.from(byId.values()).sort((a, b) => a.date.localeCompare(b.date) || b.priorityScore - a.priorityScore);
}
