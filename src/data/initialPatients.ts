import { Patient } from "../types";

const createdAt = "2026-05-02T00:00:00.000Z";

const physics = [
  "Oscilações",
  "Movimento Harmônico Simples",
  "Amplitude, período e frequência",
  "Sistema massa-mola",
  "Pêndulo simples",
  "Energia no MHS",
  "Gráficos do MHS",
  "Ondas mecânicas",
  "Elementos de uma onda",
  "Velocidade da onda",
  "Equação da onda",
  "Interferência e superposição",
  "Ondas estacionárias",
];

const economy = [
  "Inflação",
  "Taxa Selic",
  "Juros",
  "Política fiscal",
  "Política monetária",
  "Demanda agregada",
  "Gasto público",
  "Controle da inflação",
];

function makePatient(name: string, subject: string): Patient {
  const lower = name.toLowerCase();
  const avatar =
    lower.includes("onda") || lower.includes("interfer") || lower.includes("superpos") ? "avatar://fisica-nina"
    : subject === "Economia" || lower.includes("inflação") || lower.includes("juros") || lower.includes("selic") ? "avatar://economia-sofia"
    : lower.includes("pêndulo") || lower.includes("mola") || lower.includes("mhs") || lower.includes("oscil") ? "avatar://fisica-alice"
    : "avatar://civil-julia";
  return {
    id: `${subject}-${name}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-"),
    name,
    subject,
    description: `Paciente-tema de ${subject}: ${name}.`,
    status: "not_triaged",
    cureIndex: 0,
    hearts: 3,
    attempts: 0,
    consecutiveGreen: 0,
    createdAt,
    updatedAt: createdAt,
    tags: [subject, name],
    avatarUrl: avatar,
    avatarAlt: `Avatar ilustrativo do tema ${name}`,
    avatarStyle: avatar.replace("avatar://", ""),
  };
}

export const initialPatients: Patient[] = [
  ...physics.map((name) => makePatient(name, "Física 2")),
  ...economy.map((name) => makePatient(name, "Economia")),
];
