import { AppData, ImportConflictMode, Patient, Question, QuestionDifficulty } from "../types";
import { nowIso } from "./dateUtils";

const difficulties: QuestionDifficulty[] = ["easy", "medium", "hard"];

export function validateQuestion(input: Partial<Question>, index = 0): string[] {
  const errors: string[] = [];
  if (!input.id) errors.push(`Questão ${index + 1}: id obrigatório.`);
  if (!input.subject) errors.push(`Questão ${index + 1}: matéria obrigatória.`);
  if (!input.topic) errors.push(`Questão ${index + 1}: tema obrigatório.`);
  if (!input.statement) errors.push(`Questão ${index + 1}: enunciado obrigatório.`);
  if (!input.difficulty || !difficulties.includes(input.difficulty)) errors.push(`Questão ${index + 1}: dificuldade inválida.`);
  if (!Array.isArray(input.alternatives) || input.alternatives.length < 2) errors.push(`Questão ${index + 1}: use pelo menos 2 alternativas.`);
  if (!input.correctAnswer) errors.push(`Questão ${index + 1}: resposta correta obrigatória.`);
  if (input.correctAnswer && input.alternatives && !input.alternatives.includes(input.correctAnswer)) errors.push(`Questão ${index + 1}: resposta correta deve estar nas alternativas.`);
  if (!input.explanation) errors.push(`Questão ${index + 1}: explicação obrigatória.`);
  return errors;
}

export function parseQuestionsJson(json: string) {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return { questions: [], errors: ["O JSON precisa ser uma lista de questões."] };
    }
    const errors = parsed.flatMap((item, index) => validateQuestion(item, index));
    const questions = parsed.filter((item, index) => validateQuestion(item, index).length === 0) as Question[];
    return { questions, errors };
  } catch {
    return { questions: [], errors: ["JSON inválido. Confira vírgulas, aspas e colchetes."] };
  }
}

export function mergeQuestions(existing: Question[], imported: Question[], mode: ImportConflictMode) {
  const byId = new Map(existing.map((question) => [question.id, question]));
  for (const question of imported) {
    const normalized = { ...question, createdAt: question.createdAt || nowIso(), updatedAt: nowIso() };
    if (!byId.has(question.id)) {
      byId.set(question.id, normalized);
      continue;
    }
    if (mode === "replace") byId.set(question.id, normalized);
    if (mode === "duplicate") byId.set(`${question.id}-${Date.now()}`, { ...normalized, id: `${question.id}-${Date.now()}` });
  }
  return Array.from(byId.values());
}

export function createPatientsFromQuestions(patients: Patient[], questions: Question[]): Patient[] {
  const existing = new Set(patients.map((patient) => `${patient.subject}|${patient.name}`));
  const created: Patient[] = [];
  for (const question of questions) {
    const key = `${question.subject}|${question.topic}`;
    if (existing.has(key)) continue;
    existing.add(key);
    created.push({
      id: key.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
      name: question.topic,
      subject: question.subject,
      description: `Paciente criado automaticamente pela importação.`,
      status: "not_triaged",
      cureIndex: 0,
      hearts: 3,
      attempts: 0,
      consecutiveGreen: 0,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      tags: [question.subject, question.topic],
    });
  }
  return [...patients, ...created];
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseBackup(json: string): AppData | null {
  try {
    const parsed = JSON.parse(json) as AppData;
    if (!parsed.patients || !parsed.questions || !parsed.medications || !parsed.settings) return null;
    return { ...parsed, exams: parsed.exams || [], dailyStudyPlan: parsed.dailyStudyPlan || [] };
  } catch {
    return null;
  }
}
