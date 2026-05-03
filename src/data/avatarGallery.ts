export type PatientAvatarOption = {
  id: string;
  name: string;
  subject: string;
  characterType: string;
  imageUrl?: string;
  src: string;
  alt: string;
  palette: "purple" | "orange" | "blue" | "green" | "neutral";
  description: string;
};

export type AvatarOption = PatientAvatarOption;

export const subjectPalette: Record<string, PatientAvatarOption["palette"]> = {
  Economia: "purple",
  "Engenharia Civil": "orange",
  "Física 2": "blue",
  Ondas: "blue",
  Cálculo: "green",
};

export const avatarGallery: PatientAvatarOption[] = [
  { id: "avatar-economia-helena", name: "Professora Helena", subject: "Economia", characterType: "elder_glasses", src: "avatar://economia-helena", alt: "Professora Helena, personagem de Economia com óculos e expressão acolhedora.", palette: "purple", description: "Professora experiente, calma e analítica." },
  { id: "avatar-economia-lucia", name: "Dona Lúcia", subject: "Economia", characterType: "silver_bun", src: "avatar://economia-lucia", alt: "Dona Lúcia, personagem de Economia com cabelo prateado e postura serena.", palette: "purple", description: "Senhorinha culta, organizada e confiante." },
  { id: "avatar-economia-sofia", name: "Analista Sofia", subject: "Economia", characterType: "short_curly", src: "avatar://economia-sofia", alt: "Analista Sofia, personagem de Economia com cabelo curto e olhar atento.", palette: "purple", description: "Analítica, elegante e objetiva." },
  { id: "avatar-economia-mauro", name: "Professor Mauro", subject: "Economia", characterType: "beard_round", src: "avatar://economia-mauro", alt: "Professor Mauro, personagem de Economia com barba curta e óculos.", palette: "purple", description: "Professor simpático com ar de orientação." },
  { id: "avatar-economia-clara", name: "Estudante Clara", subject: "Economia", characterType: "braids_notebook", src: "avatar://economia-clara", alt: "Estudante Clara, personagem de Economia com tranças e estilo organizado.", palette: "purple", description: "Estudante metódica e preparada." },

  { id: "avatar-civil-julia", name: "Engenheira Júlia", subject: "Engenharia Civil", characterType: "helmet_ponytail", src: "avatar://civil-julia", alt: "Engenheira Júlia, personagem de Engenharia Civil com capacete discreto e colete.", palette: "orange", description: "Prática, segura e energética." },
  { id: "avatar-civil-caio", name: "Técnico Caio", subject: "Engenharia Civil", characterType: "cap_friendly", src: "avatar://civil-caio", alt: "Técnico Caio, personagem de Engenharia Civil com boné de obra e sorriso leve.", palette: "orange", description: "Trabalhador simpático e resolutivo." },
  { id: "avatar-civil-lina", name: "Arquiteta Lina", subject: "Engenharia Civil", characterType: "bob_scarf", src: "avatar://civil-lina", alt: "Arquiteta Lina, personagem de Engenharia Civil com cabelo curto e lenço.", palette: "orange", description: "Criativa, precisa e elegante." },
  { id: "avatar-civil-pedro", name: "Engenheiro Pedro", subject: "Engenharia Civil", characterType: "square_jaw", src: "avatar://civil-pedro", alt: "Engenheiro Pedro, personagem de Engenharia Civil com postura firme.", palette: "orange", description: "Profissional direto e organizado." },
  { id: "avatar-civil-ravi", name: "Estudante Ravi", subject: "Engenharia Civil", characterType: "messy_hair", src: "avatar://civil-ravi", alt: "Estudante Ravi, personagem de Engenharia Civil com cabelo bagunçado e expressão curiosa.", palette: "orange", description: "Jovem curioso com energia de projeto." },

  { id: "avatar-fisica-alice", name: "Professora Alice", subject: "Física 2", characterType: "curious_teacher", src: "avatar://fisica-alice", alt: "Professora Alice, personagem de Física 2 com expressão curiosa.", palette: "blue", description: "Curiosa, gentil e investigativa." },
  { id: "avatar-fisica-theo", name: "Pesquisador Theo", subject: "Física 2", characterType: "round_hair", src: "avatar://fisica-theo", alt: "Pesquisador Theo, personagem de Física 2 com cabelo arredondado e óculos.", palette: "blue", description: "Nerd simpático e concentrado." },
  { id: "avatar-fisica-nina", name: "Estudante Nina", subject: "Física 2", characterType: "headband", src: "avatar://fisica-nina", alt: "Estudante Nina, personagem de Física 2 com faixa no cabelo e olhar atento.", palette: "blue", description: "Atenta, leve e observadora." },
  { id: "avatar-fisica-caio", name: "Professor Caio", subject: "Física 2", characterType: "wavy_prof", src: "avatar://fisica-caio", alt: "Professor Caio, personagem de Física 2 com cabelo ondulado e expressão divertida.", palette: "blue", description: "Professor divertido e claro." },
  { id: "avatar-fisica-luna", name: "Analista Luna", subject: "Física 2", characterType: "side_part", src: "avatar://fisica-luna", alt: "Analista Luna, personagem de Física 2 com cabelo lateral e expressão observadora.", palette: "blue", description: "Observadora e precisa." },

  { id: "avatar-calculo-marta", name: "Professora Marta", subject: "Cálculo", characterType: "serious_bun", src: "avatar://calculo-marta", alt: "Professora Marta, personagem de Cálculo com coque e expressão séria.", palette: "green", description: "Séria, lógica e muito organizada." },
  { id: "avatar-calculo-leo", name: "Estudante Leo", subject: "Cálculo", characterType: "hoodie_focus", src: "avatar://calculo-leo", alt: "Estudante Leo, personagem de Cálculo com moletom e expressão concentrada.", palette: "green", description: "Concentrado e persistente." },
  { id: "avatar-calculo-bia", name: "Pesquisadora Bia", subject: "Cálculo", characterType: "curly_glasses", src: "avatar://calculo-bia", alt: "Pesquisadora Bia, personagem de Cálculo com cachos e óculos.", palette: "green", description: "Metódica e criativa." },
  { id: "avatar-calculo-daniel", name: "Professor Daniel", subject: "Cálculo", characterType: "tall_hair", src: "avatar://calculo-daniel", alt: "Professor Daniel, personagem de Cálculo com cabelo alto e postura tranquila.", palette: "green", description: "Tranquilo, lógico e didático." },
  { id: "avatar-calculo-iris", name: "Estudante Iris", subject: "Cálculo", characterType: "short_bangs", src: "avatar://calculo-iris", alt: "Estudante Iris, personagem de Cálculo com franja curta e olhar focado.", palette: "green", description: "Focada, precisa e cuidadosa." },
];

export function getDefaultAvatarForSubject(subject?: string) {
  const normalized = subject || "";
  return avatarGallery.find((avatar) => avatar.subject === normalized)
    || avatarGallery.find((avatar) => normalized.includes("Física") && avatar.subject === "Física 2")
    || avatarGallery.find((avatar) => normalized.includes("Economia") && avatar.subject === "Economia")
    || avatarGallery.find((avatar) => normalized.includes("Civil") && avatar.subject === "Engenharia Civil")
    || avatarGallery.find((avatar) => normalized.includes("Cálculo") && avatar.subject === "Cálculo")
    || avatarGallery[0];
}
