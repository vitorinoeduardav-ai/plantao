import { AppData, AppSettings, PatientRecord } from "../types";
import { initialPatients } from "../data/initialPatients";
import { initialQuestions } from "../data/initialQuestions";
import { initialTheory } from "../data/initialTheory";

const KEY = "plantao-engenharia-data-v1";

export const defaultSettings: AppSettings = {
  studentName: "Estudante",
  darkMode: false,
  examMode: false,
  appName: "Plantão da Engenharia",
};

export function getInitialData(): AppData {
  return {
    patients: initialPatients,
    questions: initialQuestions,
    medications: initialTheory,
    exams: [],
    dailyStudyPlan: [],
    records: initialPatients.map<PatientRecord>((patient) => ({
      patientId: patient.id,
      attempts: [],
      recommendedMedications: [],
    })),
    settings: defaultSettings,
  };
}

export function loadData(): AppData {
  const fallback = getInitialData();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return {
      ...fallback,
      ...parsed,
      settings: { ...defaultSettings, ...parsed.settings },
      records: parsed.records?.length ? parsed.records : fallback.records,
      exams: parsed.exams || [],
      dailyStudyPlan: parsed.dailyStudyPlan || [],
    };
  } catch {
    return fallback;
  }
}

export function saveData(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function resetData() {
  localStorage.removeItem(KEY);
  return getInitialData();
}
