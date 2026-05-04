import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { AppData, DailyStudyPlanItem, Exam, Patient, PatientAttempt, PatientStatus, Question, TriageResponse } from "./types";
import { AuthPage } from "./pages/AuthPage";
import { Layout } from "./components/Layout";
import { PageKey } from "./components/Sidebar";
import { AppRoutes } from "./routes/AppRoutes";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import { signOut as authSignOut } from "./services/authService";
import { initializeUserData } from "./services/initializeUserData";
import { attemptService } from "./services/attemptService";
import { patientService } from "./services/patientService";
import { questionService } from "./services/questionService";
import { settingsService } from "./services/settingsService";
import { theoryService } from "./services/theoryService";
import { examService } from "./services/examService";
import { studyPlanService } from "./services/studyPlanService";
import { syncEconomyExamPackage } from "./services/economyPackageService";
import { hasSyncConflicts, migrateLocalDataToCloud, summarizeSyncConflicts, SyncConflictMode } from "./services/syncService";
import { calculateCureIndex } from "./utils/calculateCureIndex";
import { classifyPatient } from "./utils/classifyPatient";
import { nowIso } from "./utils/dateUtils";
import { createPatientsFromQuestions, mergeQuestions } from "./utils/importExport";
import { loadData, resetData, saveData } from "./utils/storage";
import { scheduleNextReview } from "./utils/scheduleNextReview";
import { generateStudyPlan } from "./utils/studyPlan";
import { mergeEconomyExamPackage } from "./utils/economyPackageMerge";

export type AppActions = {
  navigate: (page: PageKey, options?: { patientId?: string; questionId?: string; medicationTopic?: string }) => void;
  setData: Dispatch<SetStateAction<AppData>>;
  upsertPatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  upsertQuestion: (question: Question) => void;
  deleteQuestion: (questionId: string) => void;
  duplicateQuestion: (questionId: string) => void;
  finishTriage: (patientId: string, responses: TriageResponse[]) => { cureIndex: number; status: PatientStatus };
  importQuestions: (questions: Question[], mode: "replace" | "ignore" | "duplicate", createPatients: boolean) => void;
  upsertExam: (exam: Exam) => void;
  deleteExam: (examId: string) => void;
  generatePlan: () => DailyStudyPlanItem[];
  togglePlanItem: (itemId: string) => void;
  resetAll: () => void;
};

export default function App() {
  const [localSnapshot] = useState<AppData>(() => loadData());
  const [data, setData] = useState<AppData>(localSnapshot);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [offlineMode, setOfflineMode] = useState(!isSupabaseConfigured);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [page, setPage] = useState<PageKey>("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | undefined>();
  const [medicationTopic, setMedicationTopic] = useState<string | undefined>();

  const userId = user?.id;

  async function fetchRemoteData(nextUserId: string): Promise<AppData> {
    await initializeUserData(nextUserId);
    await syncEconomyExamPackage(nextUserId);
    const [patients, questions, medications, attempts, settings, exams, dailyStudyPlan] = await Promise.all([
      patientService.getAll(nextUserId),
      questionService.getAll(nextUserId),
      theoryService.getAll(nextUserId),
      attemptService.getAll(nextUserId),
      settingsService.getForUser(nextUserId),
      examService.getAll(nextUserId),
      studyPlanService.getAll(nextUserId),
    ]);
    const records = patients.map((patient) => ({
      patientId: patient.id,
      attempts: attempts.filter((attempt) => attempt.patientId === patient.id),
      recommendedMedications: Array.from(new Set(attempts.filter((attempt) => attempt.patientId === patient.id).map(() => patient.name))),
    }));
    return mergeEconomyExamPackage({ patients, questions, medications, records, settings, exams, dailyStudyPlan });
  }

  async function loadRemoteData(nextUserId: string) {
    setSyncStatus("syncing");
    try {
      const remoteData = await fetchRemoteData(nextUserId);
      setData(remoteData);
      setSyncStatus("synced");
      return remoteData;
    } catch (error) {
      setSyncStatus("error");
      throw error;
    }
  }

  async function syncNow() {
    if (!userId) return;
    await loadRemoteData(userId).catch(console.error);
  }

  async function migrateLocalSnapshot() {
    if (!userId) return;
    setSyncStatus("syncing");
    try {
      const cloud = await fetchRemoteData(userId);
      const conflicts = summarizeSyncConflicts(localSnapshot, cloud);
      let mode: SyncConflictMode = "merge";
      if (hasSyncConflicts(conflicts)) {
        const answer = window.prompt(
          [
            "Foram encontrados conflitos entre dados locais e dados da nuvem.",
            `Pacientes: ${conflicts.patients}`,
            `Questões: ${conflicts.questions}`,
            `Medicamentos: ${conflicts.medications}`,
            `Provas: ${conflicts.exams}`,
            `Plano: ${conflicts.studyPlan}`,
            conflicts.settings ? "Configurações: diferentes" : "Configurações: sem conflito",
            "",
            "Digite uma opção:",
            "local = manter versão local",
            "nuvem = manter versão da nuvem",
            "mesclar = mesclar dados",
          ].join("\n"),
          "mesclar",
        );
        if (answer === null) {
          setSyncStatus("idle");
          return;
        }
        const normalized = answer.trim().toLowerCase();
        mode = normalized === "local" ? "local" : normalized === "nuvem" || normalized === "cloud" ? "cloud" : "merge";
      }
      await migrateLocalDataToCloud(userId, localSnapshot, cloud, mode);
      await loadRemoteData(userId);
      window.alert("Dados locais migrados para a nuvem. Agora tablet e notebook podem usar a mesma conta.");
    } catch (error) {
      setSyncStatus("error");
      console.error(error);
      window.alert("Não foi possível migrar os dados agora. Confira sua conexão e tente novamente.");
    }
  }

  useEffect(() => {
    setData((current) => mergeEconomyExamPackage(current));
  }, []);
  useEffect(() => saveData(data), [data]);
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(async ({ data: sessionData }) => {
      const nextUser = sessionData.session?.user || null;
      setUser(nextUser);
      if (nextUser) await loadRemoteData(nextUser.id);
      setAuthLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null;
      setUser(nextUser);
      if (nextUser) void loadRemoteData(nextUser.id);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", data.settings.darkMode);
  }, [data.settings.darkMode]);
  useEffect(() => {
    if (userId) settingsService.update(userId, "self", data.settings).catch(console.error);
  }, [data.settings, userId]);
  useEffect(() => {
    const applyLatePenalty = () => {
      setData((current) => ({
        ...current,
        patients: current.patients.map((patient) => {
          if (!patient.nextReviewAt || patient.status === "ghost" || patient.status === "not_triaged") return patient;
          const lateBy = Date.now() - new Date(patient.nextReviewAt).getTime();
          if (lateBy < 15 * 60_000 || patient.missedReviewPenaltyAt === patient.nextReviewAt) return patient;
          const hearts = Math.max(0, patient.hearts - 1);
          return {
            ...patient,
            hearts,
            status: hearts === 0 ? "ghost" : patient.status,
            missedReviewPenaltyAt: patient.nextReviewAt,
            updatedAt: nowIso(),
          };
        }),
      }));
    };
    applyLatePenalty();
    const timer = window.setInterval(applyLatePenalty, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const actions = useMemo<AppActions>(() => ({
    navigate(nextPage, options) {
      setSelectedPatientId(options?.patientId);
      setSelectedQuestionId(options?.questionId);
      setMedicationTopic(options?.medicationTopic);
      setPage(nextPage);
    },
    setData,
    upsertPatient(patient) {
      setData((current) => {
        const exists = current.patients.some((item) => item.id === patient.id);
        const patients = exists ? current.patients.map((item) => item.id === patient.id ? patient : item) : [...current.patients, patient];
        const records = current.records.some((record) => record.patientId === patient.id) ? current.records : [...current.records, { patientId: patient.id, attempts: [], recommendedMedications: [] }];
        return { ...current, patients, records };
      });
      if (userId) {
        const remote = patient.id.includes("-") && patient.id.length !== 36
          ? patientService.create(userId, patient)
          : patientService.update(userId, patient.id, patient).catch(() => patientService.create(userId, patient));
        remote.then((saved) => setData((current) => ({ ...current, patients: current.patients.map((item) => item.id === patient.id ? saved : item) }))).catch(console.error);
      }
    },
    deletePatient(patientId) {
      setData((current) => ({ ...current, patients: current.patients.filter((patient) => patient.id !== patientId), records: current.records.filter((record) => record.patientId !== patientId) }));
      if (userId) patientService.delete(userId, patientId).catch(console.error);
    },
    upsertQuestion(question) {
      setData((current) => {
        const exists = current.questions.some((item) => item.id === question.id);
        return { ...current, questions: exists ? current.questions.map((item) => item.id === question.id ? question : item) : [...current.questions, question] };
      });
      if (userId) {
        const remote = question.id.startsWith("q-") || question.id.includes("copia")
          ? questionService.create(userId, question)
          : questionService.update(userId, question.id, question).catch(() => questionService.create(userId, question));
        remote.then((saved) => setData((current) => ({ ...current, questions: current.questions.map((item) => item.id === question.id ? saved : item) }))).catch(console.error);
      }
    },
    deleteQuestion(questionId) {
      setData((current) => ({ ...current, questions: current.questions.filter((question) => question.id !== questionId) }));
      if (userId) questionService.delete(userId, questionId).catch(console.error);
    },
    duplicateQuestion(questionId) {
      setData((current) => {
        const found = current.questions.find((question) => question.id === questionId);
        if (!found) return current;
        return { ...current, questions: [...current.questions, { ...found, id: `${found.id}-copia-${Date.now()}`, createdAt: nowIso(), updatedAt: nowIso() }] };
      });
    },
    finishTriage(patientId, responses) {
      let result: { cureIndex: number; status: PatientStatus } = { cureIndex: 0, status: "red" };
      setData((current) => {
        const patient = current.patients.find((item) => item.id === patientId);
        if (!patient) return current;
        const cureIndex = calculateCureIndex(responses);
        const newStatus = classifyPatient(cureIndex, patient.status);
        const nextReviewAt = scheduleNextReview(newStatus, current.settings.examMode ? "exam" : "normal", patient.dischargeReviewStep || 0).toISOString();
        const updatedPatient: Patient = {
          ...patient,
          status: newStatus,
          cureIndex,
          hearts: Math.min(3, patient.hearts + (cureIndex >= 80 ? 1 : 0)),
          attempts: patient.attempts + 1,
          consecutiveGreen: newStatus === "green" || newStatus === "discharged" ? patient.consecutiveGreen + 1 : 0,
          dischargeReviewStep: newStatus === "discharged" ? (patient.dischargeReviewStep || 0) + 1 : patient.dischargeReviewStep,
          lastReviewAt: nowIso(),
          nextReviewAt,
          missedReviewPenaltyAt: undefined,
          updatedAt: nowIso(),
        };
        const attemptId = `attempt-${crypto.randomUUID()}`;
        const attempt: PatientAttempt = {
          id: attemptId,
          patientId,
          date: nowIso(),
          responses: responses.map((response) => ({
            ...response,
            patientId,
            answeredAt: response.answeredAt || nowIso(),
            triageAttemptId: attemptId,
          })),
          cureIndex,
          previousStatus: patient.status,
          newStatus,
          notes: responses.some((response) => response.isCorrect && response.confidence === 1) ? "Acertos com baixa confiança indicam necessidade de revisão." : undefined,
        };
        const records = current.records.some((record) => record.patientId === patientId)
          ? current.records.map((record) => record.patientId === patientId ? { ...record, attempts: [attempt, ...record.attempts], recommendedMedications: Array.from(new Set([...record.recommendedMedications, patient.name])) } : record)
          : [...current.records, { patientId, attempts: [attempt], recommendedMedications: [patient.name] }];
        result = { cureIndex, status: newStatus };
        if (userId) {
          void patientService.updatePatientAfterTriage(userId, patient, responses, current.settings.examMode).then(() => loadRemoteData(userId)).catch(console.error);
        }
        return { ...current, patients: current.patients.map((item) => item.id === patientId ? updatedPatient : item), records };
      });
      return result;
    },
    importQuestions(questions, mode, createPatients) {
      setData((current) => ({
        ...current,
        questions: mergeQuestions(current.questions, questions, mode),
        patients: createPatients ? createPatientsFromQuestions(current.patients, questions) : current.patients,
      }));
      if (userId) {
        questionService.importQuestionsFromJson(userId, questions, mode).then(() => loadRemoteData(userId)).catch(console.error);
      }
    },
    upsertExam(exam) {
      setData((current) => ({ ...current, exams: current.exams.some((item) => item.id === exam.id) ? current.exams.map((item) => item.id === exam.id ? exam : item) : [...current.exams, exam] }));
      if (userId) {
        const remote = exam.id.startsWith("exam-") ? examService.create(userId, exam) : examService.update(userId, exam.id, exam).catch(() => examService.create(userId, exam));
        remote.then((saved) => setData((current) => ({ ...current, exams: current.exams.map((item) => item.id === exam.id ? saved : item) }))).catch(console.error);
      }
    },
    deleteExam(examId) {
      setData((current) => ({ ...current, exams: current.exams.filter((exam) => exam.id !== examId), dailyStudyPlan: current.dailyStudyPlan.filter((item) => item.examId !== examId) }));
      if (userId) examService.delete(userId, examId).catch(console.error);
    },
    generatePlan() {
      const plan = generateStudyPlan(data.exams, data.patients, data.records.flatMap((record) => record.attempts), data.settings);
      setData((current) => ({ ...current, dailyStudyPlan: plan }));
      if (userId) studyPlanService.replaceAll(userId, plan).then((saved) => setData((current) => ({ ...current, dailyStudyPlan: saved }))).catch(console.error);
      return plan;
    },
    togglePlanItem(itemId) {
      setData((current) => {
        const dailyStudyPlan = current.dailyStudyPlan.map((item) => item.id === itemId ? { ...item, completed: !item.completed } : item);
        const changed = dailyStudyPlan.find((item) => item.id === itemId);
        if (userId && changed) studyPlanService.update(userId, itemId, changed).catch(console.error);
        return { ...current, dailyStudyPlan };
      });
    },
    resetAll() {
      setData(resetData());
    },
  }), [userId, data.exams, data.patients, data.records, data.settings]);

  if (authLoading) {
    return <div className="grid min-h-screen place-items-center bg-[#f7fbf9] text-sm font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-200">Carregando plantão...</div>;
  }

  if (!offlineMode && !user) {
    return <AuthPage supabaseConfigured={isSupabaseConfigured} onOffline={() => setOfflineMode(true)} onAuthenticated={async () => {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      if (userData.user) await loadRemoteData(userData.user.id);
    }} />;
  }

  return (
    <Layout
      current={page}
      settings={data.settings}
      onNavigate={(nextPage) => actions.navigate(nextPage)}
      onToggleDark={() => setData((current) => {
        const settings = { ...current.settings, darkMode: !current.settings.darkMode };
        if (userId) settingsService.update(userId, "self", settings).catch(console.error);
        return { ...current, settings };
      })}
      userEmail={user?.email}
      offlineMode={offlineMode}
      syncStatus={syncStatus}
      onSyncNow={userId ? syncNow : undefined}
      onMigrateLocal={userId ? migrateLocalSnapshot : undefined}
      onSignOut={offlineMode ? () => setOfflineMode(false) : async () => { await authSignOut(); setUser(null); setPage("dashboard"); }}
    >
      <AppRoutes data={data} actions={actions} page={page} selectedPatientId={selectedPatientId} selectedQuestionId={selectedQuestionId} medicationTopic={medicationTopic} userId={userId} offlineMode={offlineMode} />
    </Layout>
  );
}
