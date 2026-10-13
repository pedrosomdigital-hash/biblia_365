export function dataLocalHoje(): string {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

export function dataValida(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const data = new Date(`${valor}T12:00:00Z`);
  return Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) === valor;
}

// UTC keeps calendar arithmetic independent of daylight-saving transitions.
export function dataDoDia(inicio: string, dia: number): Date {
  const data = new Date(`${inicio}T12:00:00Z`);
  data.setUTCDate(data.getUTCDate() + dia - 1);
  return data;
}

export function formatarData(inicio: string, dia: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "long", year: "numeric", timeZone: "UTC",
  }).format(dataDoDia(inicio, dia));
}

export function formatarDataCurta(inicio: string, dia: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC",
  }).format(dataDoDia(inicio, dia));
}
