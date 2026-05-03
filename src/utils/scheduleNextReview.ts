import { PatientStatus } from "../types";

const minutesNormal: Record<PatientStatus, number> = {
  not_triaged: 15,
  red: 60,
  orange: 90,
  yellow: 120,
  green: 240,
  discharged: 1440,
  ghost: 0,
  sleeping: 15,
  review_due: 15,
};

const minutesExam: Record<PatientStatus, number> = {
  not_triaged: 15,
  red: 30,
  orange: 45,
  yellow: 60,
  green: 120,
  discharged: 1440,
  ghost: 0,
  sleeping: 15,
  review_due: 15,
};

const dischargeNormal = [1440, 4320, 10080, 21600];

export function scheduleNextReview(
  status: PatientStatus,
  mode: "normal" | "exam",
  dischargeReviewStep = 0,
): Date {
  const now = new Date();
  let minutes = mode === "exam" ? minutesExam[status] : minutesNormal[status];
  if (status === "discharged" && mode === "normal") {
    minutes = dischargeNormal[Math.min(dischargeReviewStep, dischargeNormal.length - 1)];
  }
  return new Date(now.getTime() + minutes * 60_000);
}
