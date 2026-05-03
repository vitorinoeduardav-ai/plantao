import { AppSettings, Patient, PatientAttempt, Question, TheoryMedication } from "../types";

export function patientFromRow(row: Record<string, any>): Patient {
  return {
    id: row.id,
    name: row.name,
    subject: row.subject,
    description: row.description || "",
    status: row.status,
    cureIndex: row.cure_index || 0,
    hearts: row.hearts || 0,
    attempts: row.attempts || 0,
    consecutiveGreen: row.consecutive_green || 0,
    nextReviewAt: row.next_review_at || undefined,
    lastReviewAt: row.last_review_at || undefined,
    tags: row.tags || [],
    avatarUrl: row.avatar_url || undefined,
    avatarAlt: row.avatar_alt || undefined,
    avatarStyle: row.avatar_style || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function patientToRow(patient: Partial<Patient>, userId: string) {
  return {
    user_id: userId,
    name: patient.name,
    subject: patient.subject,
    description: patient.description,
    status: patient.status,
    cure_index: patient.cureIndex,
    hearts: patient.hearts,
    attempts: patient.attempts,
    consecutive_green: patient.consecutiveGreen,
    next_review_at: patient.nextReviewAt,
    last_review_at: patient.lastReviewAt,
    tags: patient.tags,
    avatar_url: patient.avatarUrl,
    avatar_alt: patient.avatarAlt,
    avatar_style: patient.avatarStyle,
    updated_at: patient.updatedAt,
  };
}

export function questionFromRow(row: Record<string, any>): Question {
  return {
    id: row.id,
    subject: row.subject,
    topic: row.topic,
    difficulty: row.difficulty,
    statement: row.statement,
    alternatives: row.alternatives || [],
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    hint: row.hint || "",
    relatedFormula: row.related_formula || "",
    tags: row.tags || [],
    image: row.image_url ? { id: row.image_url, src: row.image_url, alt: row.image_alt || "", caption: row.image_caption || "" } : undefined,
    explanationImage: row.explanation_image_url ? { id: row.explanation_image_url, src: row.explanation_image_url, alt: row.explanation_image_alt || "", caption: row.explanation_image_caption || "" } : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function questionToRow(question: Partial<Question>, userId: string) {
  return {
    user_id: userId,
    subject: question.subject,
    topic: question.topic,
    difficulty: question.difficulty,
    statement: question.statement,
    alternatives: question.alternatives || [],
    correct_answer: question.correctAnswer,
    explanation: question.explanation,
    hint: question.hint,
    related_formula: question.relatedFormula,
    tags: question.tags,
    image_url: question.image?.src,
    image_alt: question.image?.alt,
    image_caption: question.image?.caption,
    explanation_image_url: question.explanationImage?.src,
    explanation_image_alt: question.explanationImage?.alt,
    explanation_image_caption: question.explanationImage?.caption,
    updated_at: question.updatedAt,
  };
}

export function medicationFromRow(row: Record<string, any>): TheoryMedication {
  return {
    id: row.id,
    subject: row.subject,
    topic: row.topic,
    title: row.title,
    summary: row.summary,
    formulas: row.formulas || [],
    whenToUse: row.when_to_use || [],
    commonMistakes: row.common_mistakes || [],
    solvedExample: row.solved_example || "",
    flashcards: row.flashcards || [],
    image: row.image_url ? { id: row.image_url, src: row.image_url } : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function medicationToRow(medication: Partial<TheoryMedication>, userId: string) {
  return {
    user_id: userId,
    subject: medication.subject,
    topic: medication.topic,
    title: medication.title,
    summary: medication.summary,
    formulas: medication.formulas || [],
    when_to_use: medication.whenToUse || [],
    common_mistakes: medication.commonMistakes || [],
    solved_example: medication.solvedExample,
    flashcards: medication.flashcards || [],
    image_url: medication.image?.src,
    updated_at: medication.updatedAt,
  };
}

export function attemptFromRow(row: Record<string, any>): PatientAttempt {
  return {
    id: row.id,
    patientId: row.patient_id,
    date: row.created_at,
    responses: row.responses || [],
    cureIndex: row.cure_index,
    previousStatus: row.previous_status,
    newStatus: row.new_status,
    notes: row.notes || undefined,
  };
}

export function settingsFromRow(row: Record<string, any>): AppSettings {
  return {
    studentName: row.student_name || "",
    appName: row.app_name || "Plantão da Engenharia",
    darkMode: Boolean(row.dark_mode),
    examMode: Boolean(row.exam_mode),
  };
}

export function settingsToRow(settings: Partial<AppSettings>, userId: string) {
  return {
    user_id: userId,
    student_name: settings.studentName,
    app_name: settings.appName,
    dark_mode: settings.darkMode,
    exam_mode: settings.examMode,
    updated_at: new Date().toISOString(),
  };
}
