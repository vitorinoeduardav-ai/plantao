import { TriageResponse } from "../types";

export function calculateCureIndex(responses: TriageResponse[]): number {
  if (!responses.length) return 0;

  const correct = responses.filter((response) => response.isCorrect).length;
  const scoreQuestoes = correct / responses.length;
  const scoreConfianca =
    responses.reduce((sum, response) => sum + (response.confidence - 1) / 3, 0) /
    responses.length;
  const overconfidentPenalty =
    responses.filter((response) => !response.isCorrect && response.confidence === 4).length * 5;

  const raw = Math.round((scoreQuestoes * 0.75 + scoreConfianca * 0.25) * 100) - overconfidentPenalty;
  return Math.min(100, Math.max(0, raw));
}
