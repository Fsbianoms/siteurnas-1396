import { ExternalLink, MapPin, ChevronDown } from "lucide-react";
import type { ElectionCandidate, ElectionSection } from "../../../shared/election";
import { code, number, officialLink, firstVote, percent } from "../../lib/election";

export function SectionDetail({
  section: s,
  candidates,
}: {
  section: ElectionSection | null;
  candidates: ElectionCandidate[];
}) {
  if (!s)
    return (
      <aside className="detail-panel empty-detail">
        <MapPin size={30} />
        <h2>Escolha uma seção</h2>
        <p>Clique em uma linha da tabela ou em um município no mapa para ver os votos.</p>
      </aside>
    );
  const valid2 = s.second.lula + s.second.flavio;
  return (
    <aside className="detail-panel" aria-label="Detalhes da seção selecionada">
      <div className="detail-title">
        <span className="eyebrow">SEÇÃO EM FOCO</span>
        <span className="uf-tag">{s.uf}</span>
      </div>
      <h2>{s.city.toLocaleLowerCase("pt-BR")}</h2>
      <div className="detail-codes">
        <span>
          Zona <strong>{code(s.zone)}</strong>
        </span>
        <span>
          Seção <strong>{code(s.section)}</strong>
        </span>
      </div>
      <div className="detail-table">
        <div className="comparison-head">
          <span>Candidato</span>
          <span>1º turno</span>
          <span>2º turno</span>
        </div>
        {(["lula", "flavio"] as const).map((candidate) => {
          const v1 = firstVote(s, candidate),
            v2 = s.second[candidate];
          return (
            <div className="candidate-row" key={candidate}>
              <div>
                <span className={`candidate-mark ${candidate}`} />
                <strong>{candidate === "lula" ? "Lula" : "Flavio Bolsonaro"}</strong>
                <small>{candidate === "lula" ? "PT · 13" : "PL · 22"}</small>
              </div>
              <div>
                <strong>{number(v1)}</strong>
                <small>{percent(v1, s.validFirst)}</small>
              </div>
              <div className={v2 <= 5 ? "low-vote" : ""}>
                <strong>{number(v2)}</strong>
                <small>{percent(v2, valid2)}</small>
              </div>
            </div>
          );
        })}
        <div className="comparison-extra">
          <span>Outros candidatos</span>
          <span>{number(s.validFirst - firstVote(s, "lula") - firstVote(s, "flavio"))}</span>
          <span>—</span>
        </div>
        <div className="comparison-extra">
          <span>Brancos</span>
          <span>{number(s.first["95"] ?? 0)}</span>
          <span>{number(s.second.blank)}</span>
        </div>
        <div className="comparison-extra">
          <span>Nulos</span>
          <span>{number((s.first["96"] ?? 0) + (s.first["28"] ?? 0))}</span>
          <span>{number(s.second.null)}</span>
        </div>
      </div>
      <details className="all-candidates">
        <summary>
          Todos os candidatos do 1º turno <ChevronDown size={15} />
        </summary>
        <div>
          {[...candidates]
            .sort((a, b) => (s.first[String(b.number)] ?? 0) - (s.first[String(a.number)] ?? 0))
            .map((c) => (
              <div key={c.number}>
                <span>
                  {c.name.toLocaleLowerCase("pt-BR")} <small>{c.number}</small>
                </span>
                <strong>{number(s.first[String(c.number)] ?? 0)}</strong>
              </div>
            ))}
          <div>
            <span>
              Leonardo Alves de Araujo <small>28 · nulos técnicos</small>
            </span>
            <strong>{number(s.first["28"] ?? 0)}</strong>
          </div>
        </div>
      </details>
      <div className="location">
        <MapPin size={15} />
        <div>
          <strong>{s.local.toLocaleLowerCase("pt-BR")}</strong>
          <small>{s.address.toLocaleLowerCase("pt-BR")}</small>
        </div>
      </div>
      <div className="official-box">
        <strong>Conferir no site oficial</strong>
        <p>
          Os links abaixo abrem o <b>total da zona {code(s.zone)}</b>, não o resultado isolado desta
          seção.
        </p>
        <div>
          {([1, 2] as const).map((turn) => (
            <a key={turn} target="_blank" rel="noopener noreferrer" href={officialLink(s, turn)}>
              {turn}º turno · TSE
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
