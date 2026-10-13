import { dataValida } from "./datasPlano.ts";

export interface Progresso {
  dataInicio: string;
  dia: number;
  diasConcluidos: number[];
}

export function progressoVazio(): Progresso {
  return { dataInicio: "", dia: 1, diasConcluidos: [] };
}

export function normalizarProgresso(valor: unknown): Progresso {
  if (!valor || typeof valor !== "object") return progressoVazio();
  const dados = valor as Record<string, unknown>;
  return {
    dataInicio: typeof dados.dataInicio === "string" && dataValida(dados.dataInicio) ? dados.dataInicio : "",
    dia: typeof dados.dia === "number" && Number.isInteger(dados.dia) && dados.dia >= 1 && dados.dia <= 365 ? dados.dia : 1,
    diasConcluidos: Array.isArray(dados.diasConcluidos) ? [...new Set(dados.diasConcluidos.filter((dia): dia is number => typeof dia === "number" && Number.isInteger(dia) && dia >= 1 && dia <= 365))].sort((a, b) => a - b) : [],
  };
}

export function lerProgressoLocal(): Progresso {
  try {
    return normalizarProgresso({
      dataInicio: localStorage.getItem("biblia365-data-inicio"),
      dia: Number(localStorage.getItem("biblia365-dia-atual")),
      diasConcluidos: JSON.parse(localStorage.getItem("biblia365-progresso") || "[]"),
    });
  } catch { return progressoVazio(); }
}

export function unirProgressos(conta: Progresso, local: Progresso): Progresso {
  return {
    dataInicio: conta.dataInicio || local.dataInicio,
    dia: conta.dataInicio || conta.diasConcluidos.length ? conta.dia : local.dia,
    diasConcluidos: [...new Set([...conta.diasConcluidos, ...local.diasConcluidos])].sort((a, b) => a - b),
  };
}
