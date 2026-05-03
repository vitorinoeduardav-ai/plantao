export function formatDateTime(value?: string) {
  if (!value) return "Sem retorno marcado";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getTimeRemaining(target?: string) {
  if (!target) return { expired: false, label: "sem retorno" };
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { expired: true, label: "revisão vencida" };
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return { expired: false, label: `${days}d ${hours % 24}h` };
  if (hours > 0) return { expired: false, label: `${hours}h ${minutes % 60}min` };
  return { expired: false, label: `${Math.max(1, minutes)}min` };
}

export function nowIso() {
  return new Date().toISOString();
}
