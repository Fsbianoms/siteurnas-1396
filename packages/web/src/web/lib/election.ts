import type { ElectionSection } from "../../shared/election";

export const number = (value: number) => value.toLocaleString("pt-BR");
export const code = (value: number) => String(value).padStart(4, "0");
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
export const cityKey = (s: ElectionSection) => `${s.uf}-${s.cityCode}`;
export function officialLink(s: ElectionSection, turn: 1 | 2) {
  return `https://resultados.tse.jus.br/oficial/app/index.html#/eleicao/${turn === 1 ? "6257" : "6258"}/uf/${s.uf.toLowerCase()}/mu/${s.cityCode}/zn/${code(s.zone)}/cargo/1/vis/nominal/resultados`;
}
export function firstVote(s: ElectionSection, candidate: "lula" | "flavio") {
  return s.first[candidate === "lula" ? "13" : "22"] ?? 0;
}
export const percent = (votes: number, valid: number) =>
  valid
    ? `${((100 * votes) / valid).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
    : "—";
