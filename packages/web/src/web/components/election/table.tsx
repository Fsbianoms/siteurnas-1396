import { useEffect, useState } from "react";
import { ArrowUpDown, ChevronLeft, ChevronRight, ExternalLink, ArrowUpRight } from "lucide-react";
import type { ElectionSection } from "../../../shared/election";
import { code, number, officialLink, firstVote } from "../../lib/election";

export function SectionTable({
  sections,
  selected,
  onSelect,
}: {
  sections: ElectionSection[];
  selected: ElectionSection | null;
  onSelect: (s: ElectionSection) => void;
}) {
  const [page, setPage] = useState(0);
  const [turn, setTurn] = useState<1 | 2>(2);
  const [sort, setSort] = useState(false);
  const signature = sections.map((s) => s.id).join(",");
  useEffect(() => {
    setPage(0);
  }, [signature, sort]);
  const sorted = sort
    ? [...sections].sort(
        (a, b) =>
          Math.max(b.second.lula, b.second.flavio) - Math.max(a.second.lula, a.second.flavio),
      )
    : sections;
  const size = 12,
    pages = Math.max(1, Math.ceil(sorted.length / size));
  const visible = sorted.slice(page * size, (page + 1) * size);
  return (
    <section className="table-panel" aria-label="Tabela de seções">
      <div className="table-heading">
        <div>
          <h2>Explore cada seção</h2>
          <p>{number(sections.length)} resultados no filtro atual</p>
        </div>
        <div className="turn-switch" aria-label="Turno exibido na tabela">
          <button className={turn === 1 ? "active" : ""} onClick={() => setTurn(1)}>
            1º turno
          </button>
          <button className={turn === 2 ? "active" : ""} onClick={() => setTurn(2)}>
            2º turno
          </button>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Município / UF</th>
              <th>Zona</th>
              <th>Seção</th>
              <th>Lula</th>
              <th>Flavio Bolsonaro</th>
              <th>
                <button
                  onClick={() => setSort((v) => !v)}
                  title="Ordenar por maior votação no 2º turno"
                >
                  Critério no 2º turno
                  <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Conferir zona</th>
              <th aria-label="Detalhes da seção" />
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr
                key={s.id}
                className={selected?.id === s.id ? "selected-row" : ""}
                onClick={() => onSelect(s)}
              >
                <td>
                  <button className="city-button" onClick={() => onSelect(s)}>
                    {s.city.toLocaleLowerCase("pt-BR")} <span>{s.uf}</span>
                  </button>
                </td>
                <td>{code(s.zone)}</td>
                <td>{code(s.section)}</td>
                <td className={turn === 2 && s.second.lula <= 5 ? "low-cell" : ""}>
                  {number(turn === 1 ? firstVote(s, "lula") : s.second.lula)}
                </td>
                <td className={turn === 2 && s.second.flavio <= 5 ? "low-cell" : ""}>
                  {number(turn === 1 ? firstVote(s, "flavio") : s.second.flavio)}
                </td>
                <td>
                  <span
                    className={`criterion-pill ${s.lowCandidate === "lula" ? "amber-pill" : ""}`}
                  >
                    {s.lowCandidate === "lula" ? "Lula" : "Flavio"} ≤ 5
                  </span>
                </td>
                <td>
                  <a
                    href={officialLink(s, turn)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Conferir zona ${code(s.zone)} de ${s.city} no ${turn}º turno no TSE`}
                  >
                    TSE <ExternalLink size={12} />
                  </a>
                </td>
                <td>
                  <button
                    className="row-open"
                    aria-label={`Ver detalhes da seção ${code(s.section)} de ${s.city}`}
                    onClick={() => onSelect(s)}
                  >
                    <ArrowUpRight size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!sections.length && (
          <div className="table-empty">
            <h3>Nenhuma seção encontrada</h3>
            <p>Experimente outro município ou limpe os filtros.</p>
          </div>
        )}
      </div>
      <div className="table-footer">
        <span>
          {sections.length
            ? `${page * size + 1}–${Math.min((page + 1) * size, sections.length)}`
            : "0"}{" "}
          de {number(sections.length)} seções
        </span>
        <div>
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={16} />
          </button>
          <span>
            {page + 1} / {pages}
          </span>
          <button
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => p + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
