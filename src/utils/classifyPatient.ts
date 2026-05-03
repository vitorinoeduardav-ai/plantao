import { PatientStatus } from "../types";

export function classifyPatient(cureIndex: number, previousStatus?: PatientStatus): PatientStatus {
  if (previousStatus === "green" && cureIndex >= 80) return "discharged";
  if (previousStatus === "discharged" && cureIndex >= 90) return "discharged";
  if (cureIndex >= 90 && previousStatus && previousStatus !== "not_triaged") return "discharged";
  if (cureIndex >= 80) return "green";
  if (cureIndex >= 60) return "yellow";
  if (cureIndex >= 40) return "orange";
  return "red";
}

export const wardMessages: Record<PatientStatus, string> = {
  not_triaged: "Paciente ainda não passou pela recepção de triagem.",
  red: "Esse paciente está grave. Antes de tentar novas questões, estude a bula completa deste tema.",
  orange: "Você tem uma base, mas ainda existem lacunas importantes. Revise os conceitos principais e faça questões guiadas.",
  yellow: "Você está no caminho. Foque nos erros e nos pontos específicos que apareceram na lista.",
  green: "Boa! O paciente está estável. Agora falta confirmar se esse domínio se mantém na próxima revisão.",
  discharged: "Paciente recebeu alta! Ele voltará depois para revisão espaçada.",
  ghost: "Esse paciente ficou tempo demais sem revisão e virou fantasma. Ele precisa voltar para a triagem.",
  sleeping: "Paciente em repouso. O retorno ainda não chegou.",
  review_due: "Paciente com revisão pendente. Hora de atender de novo.",
};
