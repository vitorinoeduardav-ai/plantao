import { buildEconomyExam, buildEconomyIntensivePlan, economyExamMedications, economyExamPatients, economyExamQuestions } from "../data/economyExamPackage";
import { Patient } from "../types";
import { patientService } from "./patientService";
import { questionService } from "./questionService";
import { theoryService } from "./theoryService";
import { examService } from "./examService";
import { studyPlanService } from "./studyPlanService";

function normalize(value: string) {
  return value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function syncEconomyExamPackage(userId: string) {
  const existingPatients = await patientService.getAll(userId);
  const patients: Patient[] = [...existingPatients];
  for (const patient of economyExamPatients) {
    const found = patients.find((item) => item.subject === "Economia" && normalize(item.name) === normalize(patient.name));
    if (!found) {
      const saved = await patientService.create(userId, patient);
      patients.push(saved);
    } else if (!found.avatarUrl || !found.description) {
      const saved = await patientService.update(userId, found.id, {
        description: found.description || patient.description,
        avatarUrl: found.avatarUrl || patient.avatarUrl,
        avatarAlt: found.avatarAlt || patient.avatarAlt,
        avatarStyle: found.avatarStyle || patient.avatarStyle,
        tags: Array.from(new Set([...(found.tags || []), ...(patient.tags || [])])),
      });
      patients.splice(patients.findIndex((item) => item.id === found.id), 1, saved);
    }
  }

  const existingMeds = await theoryService.getAll(userId);
  for (const med of economyExamMedications) {
    const found = existingMeds.find((item) => item.id === med.id || (item.subject === "Economia" && normalize(item.topic) === normalize(med.topic)));
    if (found) await theoryService.update(userId, found.id, med);
    else await theoryService.create(userId, med);
  }

  const existingQuestions = await questionService.getAll(userId);
  for (const question of economyExamQuestions) {
    if (!existingQuestions.some((item) => item.id === question.id)) {
      await questionService.create(userId, question);
    }
  }

  const exam = buildEconomyExam(patients);
  const existingExams = await examService.getAll(userId);
  const foundExam = existingExams.find((item) => item.id === exam.id || (item.title === exam.title && item.subject === exam.subject));
  const savedExam = foundExam ? await examService.update(userId, foundExam.id, exam) : await examService.create(userId, exam);
  const plan = buildEconomyIntensivePlan({ ...exam, id: savedExam.id }, patients);
  await studyPlanService.replaceAll(userId, plan);
}
