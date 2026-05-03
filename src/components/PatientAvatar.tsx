import { Patient } from "../types";
import { avatarGallery, getDefaultAvatarForSubject, PatientAvatarOption } from "../data/avatarGallery";
import { StoredImage } from "./StoredImage";

const palettes = {
  purple: { bg: "#f3e8ff", accent: "#7c3aed", dark: "#3b0764", soft: "#ddd6fe" },
  orange: { bg: "#ffedd5", accent: "#f97316", dark: "#7c2d12", soft: "#fed7aa" },
  blue: { bg: "#dbeafe", accent: "#2563eb", dark: "#1e3a8a", soft: "#bfdbfe" },
  green: { bg: "#dcfce7", accent: "#16a34a", dark: "#14532d", soft: "#bbf7d0" },
  neutral: { bg: "#e2e8f0", accent: "#475569", dark: "#0f172a", soft: "#cbd5e1" },
};

export function PatientAvatar({ patient, size = "md" }: { patient: Patient; size?: "sm" | "md" | "lg" }) {
  const dimension = size === "lg" ? "h-24 w-24" : size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const initials = patient.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const legacy = mapLegacyAvatar(patient.avatarUrl);
  const gallery = avatarGallery.find((avatar) => avatar.src === (legacy || patient.avatarUrl)) || (!patient.avatarUrl ? getDefaultAvatarForSubject(patient.subject) : undefined);

  if (patient.avatarUrl && !patient.avatarUrl.startsWith("avatar://")) {
    return (
      <div className={`${dimension} shrink-0 overflow-hidden rounded-full`}>
        <StoredImage image={{ id: patient.avatarUrl, src: patient.avatarUrl, alt: patient.avatarAlt || patient.name }} />
      </div>
    );
  }

  if (gallery) {
    return (
      <div className={`${dimension} grid shrink-0 place-items-center overflow-hidden rounded-full border-2 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900`} style={{ borderColor: palettes[gallery.palette].accent }} title={patient.avatarAlt || gallery.alt}>
        <AvatarIllustration avatar={gallery} />
      </div>
    );
  }

  return (
    <div className={`${dimension} grid shrink-0 place-items-center rounded-full border border-slate-200 bg-gradient-to-br from-teal-100 to-sky-100 text-lg font-black text-teal-900 dark:border-slate-700 dark:from-slate-800 dark:to-slate-700 dark:text-teal-100`}>
      {initials}
    </div>
  );
}

function mapLegacyAvatar(src?: string) {
  const legacy: Record<string, string> = {
    "avatar://economy": "avatar://economia-sofia",
    "avatar://civil": "avatar://civil-julia",
    "avatar://calculus": "avatar://calculo-marta",
    "avatar://oscillations": "avatar://fisica-alice",
    "avatar://waves": "avatar://fisica-nina",
  };
  return src ? legacy[src] : undefined;
}

export function AvatarIllustration({ avatar }: { avatar: PatientAvatarOption }) {
  const palette = palettes[avatar.palette];
  const variant = getVariant(avatar.characterType);
  return (
    <svg viewBox="0 0 120 120" role="img" className="h-full w-full">
      <rect width="120" height="120" rx="60" fill={palette.bg} />
      <circle cx="92" cy="26" r="14" fill={palette.soft} opacity="0.9" />
      <circle cx="26" cy="96" r="18" fill={palette.soft} opacity="0.65" />
      {variant.accessory === "helmet" && <path d="M38 40c3-24 41-24 44 0" fill="#f59e0b" stroke={palette.dark} strokeWidth="2" />}
      <circle cx="60" cy="49" r={variant.faceRadius} fill={variant.skin} />
      <Hair variant={variant.hair} color={variant.hairColor} />
      {variant.accessory === "glasses" && <Glasses />}
      {variant.accessory === "headband" && <path d="M40 38c12-10 28-10 40 0" stroke={palette.accent} strokeWidth="5" strokeLinecap="round" fill="none" />}
      {variant.accessory === "scarf" && <path d="M52 75l16 1 8 18-18-8-14 8z" fill={palette.soft} stroke={palette.accent} strokeWidth="2" />}
      <circle cx="53" cy="51" r={variant.eye} fill={palette.dark} />
      <circle cx="68" cy="51" r={variant.eye} fill={palette.dark} />
      <path d={variant.mouth} stroke={palette.dark} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d={variant.body} fill={palette.accent} />
      <path d="M43 82c9 6 25 6 34 0" stroke="rgba(255,255,255,.65)" strokeWidth="4" strokeLinecap="round" />
      <circle cx="39" cy="72" r="5" fill={variant.skin} />
      <circle cx="81" cy="72" r="5" fill={variant.skin} />
      {variant.detail === "book" && <rect x="74" y="70" width="18" height="14" rx="2" fill="#fff" stroke={palette.dark} strokeWidth="2" />}
      {variant.detail === "badge" && <circle cx="76" cy="83" r="4" fill="#fff" opacity="0.85" />}
      {variant.detail === "pen" && <path d="M79 68l12-8" stroke={palette.dark} strokeWidth="3" strokeLinecap="round" />}
    </svg>
  );
}

function getVariant(type: string) {
  const variants: Record<string, { skin: string; hair: string; hairColor: string; faceRadius: number; eye: number; mouth: string; body: string; accessory?: string; detail?: string }> = {
    elder_glasses: { skin: "#f1c7a8", hair: "soft_bob", hairColor: "#d6d3d1", faceRadius: 18, eye: 2.2, mouth: "M54 61c4 3 9 3 13 0", body: "M32 112c5-30 51-30 56 0z", accessory: "glasses", detail: "book" },
    silver_bun: { skin: "#e8b995", hair: "bun", hairColor: "#cbd5e1", faceRadius: 18, eye: 2.1, mouth: "M54 61c5 2 8 2 13 0", body: "M31 112c8-28 50-28 58 0z", detail: "badge" },
    short_curly: { skin: "#8d5524", hair: "curly", hairColor: "#1f2937", faceRadius: 18, eye: 2.2, mouth: "M54 62c3 4 10 4 13 0", body: "M30 112c7-31 53-31 60 0z", detail: "pen" },
    beard_round: { skin: "#d6a57c", hair: "round", hairColor: "#3f2a1d", faceRadius: 19, eye: 2.2, mouth: "M53 62c4 3 10 3 14 0", body: "M30 112c6-29 54-29 60 0z", accessory: "glasses" },
    braids_notebook: { skin: "#b87951", hair: "braids", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M54 61c4 4 9 4 13 0", body: "M32 112c6-30 50-30 56 0z", detail: "book" },
    helmet_ponytail: { skin: "#c68642", hair: "ponytail", hairColor: "#3b2416", faceRadius: 18, eye: 2.2, mouth: "M54 61c4 4 10 4 14 0", body: "M29 112c8-30 54-30 62 0z", accessory: "helmet" },
    cap_friendly: { skin: "#f0c6a5", hair: "cap", hairColor: "#5b3b24", faceRadius: 18, eye: 2.3, mouth: "M53 60c5 5 11 5 16 0", body: "M31 112c8-28 50-28 58 0z" },
    bob_scarf: { skin: "#e0ac8b", hair: "bob", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M54 62c4 3 9 3 13 0", body: "M30 112c8-30 52-30 60 0z", accessory: "scarf" },
    square_jaw: { skin: "#b87951", hair: "short", hairColor: "#2f1f16", faceRadius: 19, eye: 2.1, mouth: "M55 62c3 2 8 2 11 0", body: "M28 112c9-27 55-27 64 0z", detail: "badge" },
    messy_hair: { skin: "#f1c7a8", hair: "messy", hairColor: "#4b2e1f", faceRadius: 18, eye: 2.3, mouth: "M53 61c5 4 11 4 16 0", body: "M32 112c5-29 51-29 56 0z" },
    curious_teacher: { skin: "#f0c6a5", hair: "wave", hairColor: "#7c2d12", faceRadius: 18, eye: 2.3, mouth: "M54 61c4 4 10 4 14 0", body: "M31 112c6-31 52-31 58 0z", detail: "pen" },
    round_hair: { skin: "#d6a57c", hair: "round", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M54 62c4 3 9 3 13 0", body: "M30 112c8-29 52-29 60 0z", accessory: "glasses" },
    headband: { skin: "#8d5524", hair: "puff", hairColor: "#111827", faceRadius: 18, eye: 2.2, mouth: "M54 61c4 4 10 4 14 0", body: "M32 112c5-30 51-30 56 0z", accessory: "headband" },
    wavy_prof: { skin: "#e0ac8b", hair: "wavy", hairColor: "#334155", faceRadius: 19, eye: 2.2, mouth: "M53 60c5 5 12 5 17 0", body: "M29 112c8-30 54-30 62 0z" },
    side_part: { skin: "#f1c7a8", hair: "side", hairColor: "#1f2937", faceRadius: 18, eye: 2.1, mouth: "M54 62c4 3 9 3 13 0", body: "M31 112c7-29 51-29 58 0z", detail: "badge" },
    serious_bun: { skin: "#d6a57c", hair: "bun", hairColor: "#2f1f16", faceRadius: 18, eye: 2.0, mouth: "M55 63c3 1 8 1 11 0", body: "M30 112c8-28 52-28 60 0z", accessory: "glasses" },
    hoodie_focus: { skin: "#c68642", hair: "short", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M55 62c3 2 8 2 11 0", body: "M28 112c10-31 55-31 64 0z" },
    curly_glasses: { skin: "#8d5524", hair: "curly", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M54 61c4 3 10 3 14 0", body: "M31 112c7-30 52-30 59 0z", accessory: "glasses" },
    tall_hair: { skin: "#e0ac8b", hair: "tall", hairColor: "#3f2a1d", faceRadius: 19, eye: 2.2, mouth: "M54 61c4 4 10 4 14 0", body: "M29 112c8-29 54-29 62 0z", detail: "pen" },
    short_bangs: { skin: "#f0c6a5", hair: "bangs", hairColor: "#111827", faceRadius: 18, eye: 2.1, mouth: "M54 62c4 3 9 3 13 0", body: "M32 112c5-30 51-30 56 0z", detail: "book" },
  };
  return variants[type] || variants.elder_glasses;
}

function Hair({ variant, color }: { variant: string; color: string }) {
  const common = { fill: color };
  if (variant === "bun") return <><circle cx="60" cy="25" r="10" {...common} /><path d="M39 45c2-23 39-27 43-2-14-8-29-8-43 2z" {...common} /></>;
  if (variant === "curly") return <>{[40, 48, 56, 64, 72, 80].map((x) => <circle key={x} cx={x} cy={38 + (x % 3)} r="9" {...common} />)}</>;
  if (variant === "braids") return <><path d="M38 42c8-22 36-22 44 0-12-5-29-5-44 0z" {...common} /><path d="M38 55c-11 13-6 28 6 35" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" /><path d="M82 55c11 13 6 28-6 35" stroke={color} strokeWidth="7" fill="none" strokeLinecap="round" /></>;
  if (variant === "ponytail") return <><path d="M39 43c5-24 36-25 43 0-13-6-28-6-43 0z" {...common} /><circle cx="83" cy="53" r="12" {...common} /></>;
  if (variant === "cap") return <><path d="M38 39c9-18 36-18 45 0z" fill={color} /><path d="M34 41h55" stroke={color} strokeWidth="7" strokeLinecap="round" /></>;
  if (variant === "bob") return <path d="M36 49c0-28 48-28 48 0v10c-12-9-36-9-48 0z" {...common} />;
  if (variant === "messy") return <path d="M37 43l9-15 7 11 8-14 7 13 10-10 5 18c-15-8-31-8-46-3z" {...common} />;
  if (variant === "wave" || variant === "wavy") return <path d="M37 44c4-23 17-15 26-19 12-5 22 6 20 21-14-8-30-8-46-2z" {...common} />;
  if (variant === "puff") return <><circle cx="43" cy="38" r="12" {...common} /><circle cx="77" cy="38" r="12" {...common} /><path d="M41 45c9-15 30-15 39 0z" {...common} /></>;
  if (variant === "side") return <path d="M37 43c4-24 42-24 47 1-18-10-32-7-47-1z" {...common} />;
  if (variant === "tall") return <path d="M40 42c1-30 39-35 43 1-13-8-29-8-43-1z" {...common} />;
  if (variant === "bangs") return <path d="M37 44c4-23 43-23 47 0-8-4-12 7-18 0-5 8-10-4-15 4-4-7-8 0-14-4z" {...common} />;
  if (variant === "soft_bob") return <path d="M38 46c3-24 40-25 44 0-11-8-33-8-44 0z" {...common} />;
  return <path d="M39 43c6-22 36-22 43 0-13-6-28-6-43 0z" {...common} />;
}

function Glasses() {
  return <><circle cx="53" cy="51" r="7" fill="none" stroke="#1f2937" strokeWidth="2" /><circle cx="68" cy="51" r="7" fill="none" stroke="#1f2937" strokeWidth="2" /><path d="M60 51h1" stroke="#1f2937" strokeWidth="2" /></>;
}
