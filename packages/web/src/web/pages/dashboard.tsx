import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Download,
  Info,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";
import { useElection } from "../queries/election";
import type { ElectionSection } from "../../shared/election";
import { number, cityKey, normalize } from "../lib/election";
import { ElectionMap } from "../components/election/map";
import { SectionDetail } from "../components/election/detail";
import { SectionTable } from "../components/election/table";

const EMPTY_SECTIONS: ElectionSection[] = [];

export default function Dashboard() {
  const query = useElection();
  const [uf, setUf] = useState("");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [low, setLow] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [method, setMethod] = useState(false);
  const sections = query.data?.sections ?? EMPTY_SECTIONS;
  const cities = useMemo(
    () =>
      [
        ...new Map(sections.filter((s) => !uf || s.uf === uf).map((s) => [cityKey(s), s])).values(),
      ].sort((a, b) => a.city.localeCompare(b.city, "pt-BR")),
    [sections, uf],
  );
  const filtered = useMemo(
    () =>
      sections.filter(
        (s) =>
          (!uf || s.uf === uf) &&
          (!city || cityKey(s) === city) &&
          (!low || s.lowCandidate === low) &&
          (!search ||
            normalize(
              `${s.city} ${s.uf} ${s.zone} ${s.section} ${String(s.zone).padStart(4, "0")} ${String(s.section).padStart(4, "0")} ${s.local}`,
            ).includes(normalize(search))),
      ),
    [sections, uf, city, search, low],
  );
  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null;
  const clear = () => {
    setUf("");
    setCity("");
    setSearch("");
    setLow("");
    setSelectedId("");
  };
  const hasFilters = !!(uf || city || search || low);
  useEffect(() => {
    if (!method) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMethod(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [method]);
  const selectFromMap = (s: ElectionSection) => {
    setUf(s.uf);
    setCity(cityKey(s));
    setSelectedId(s.id);
    setSearch("");
  };
  return (
    <div className="dashboard">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand" aria-label="Mapa eleitoral início">
            <span className="brand-icon">
              <MapPin size={22} />
            </span>
            <span>
              mapa<span className="brand-light">eleitoral</span>
              <small>ELEIÇÕES 2026</small>
            </span>
          </a>
          <nav>
            <a href="#explorar" className="nav-active">
              Explorar
            </a>
            <button onClick={() => setMethod(true)}>
              Sobre os dados <ArrowUpRight size={13} />
            </button>
          </nav>
          <a className="download-button" href="/downloads/comparacao-643-secoes-2026.xlsx" download>
            <Download size={16} />
            <span>Baixar planilha</span>
          </a>
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="intro-label">
              <span />
              PRESIDENTE · BRASIL · 2026
            </div>
            <h1>
              Cada seção, <span>dois turnos.</span>
            </h1>
            <p>Explore as mesmas 643 seções, compare os votos e consulte a fonte oficial.</p>
          </div>
          <button className="source-tag" onClick={() => setMethod(true)}>
            <CheckCircle2 size={16} />
            <div>
              Dados oficiais do TSE<small>Base gerada em 26 out. 2026</small>
            </div>
            <Info size={14} />
          </button>
        </section>
        <section className="metrics" aria-label="Resumo do recorte">
          <div>
            <strong>643</strong>
            <span>seções selecionadas</span>
          </div>
          <div>
            <strong>309</strong>
            <span>municípios / localidades</span>
          </div>
          <div>
            <strong>
              24<span className="metric-unit"> UFs</span>
            </strong>
            <span>com casos neste recorte</span>
          </div>
          <div>
            <strong>
              2<span className="metric-unit"> turnos</span>
            </strong>
            <span>nas mesmas seções</span>
          </div>
          <p>
            <SlidersHorizontal size={17} />
            <span>
              Critério do 2º turno<strong>Até 5 votos × pelo menos 100</strong>
            </span>
          </p>
        </section>
        <div id="explorar" className="filter-bar">
          <label className="search-field">
            <Search size={17} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar município, zona ou seção"
              aria-label="Buscar município, zona ou seção"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Limpar busca">
                <X size={14} />
              </button>
            )}
          </label>
          <label className="select-field">
            <span>Estado</span>
            <select
              aria-label="Filtrar por estado"
              value={uf}
              onChange={(e) => {
                setUf(e.target.value);
                setCity("");
              }}
            >
              <option value="">Todo o Brasil</option>
              {Object.entries(query.data?.states ?? {})
                .sort()
                .map(([key, name]) => (
                  <option value={key} key={key}>
                    {key} · {name}
                  </option>
                ))}
            </select>
          </label>
          <label className="select-field municipality-select">
            <span>Município</span>
            <select
              aria-label="Filtrar por município"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Todos os municípios</option>
              {cities.map((s) => (
                <option key={cityKey(s)} value={cityKey(s)}>
                  {s.city} · {s.uf}
                </option>
              ))}
            </select>
          </label>
          <label className="select-field candidate-select">
            <span>Até 5 votos no 2º turno</span>
            <select
              aria-label="Filtrar candidato com até 5 votos"
              value={low}
              onChange={(e) => setLow(e.target.value)}
            >
              <option value="">Ambos os candidatos</option>
              <option value="flavio">Flavio Bolsonaro</option>
              <option value="lula">Lula</option>
            </select>
          </label>
          {hasFilters && (
            <button className="clear-filter" onClick={clear} title="Limpar todos os filtros">
              <X size={14} />
              Limpar
            </button>
          )}
        </div>
        {query.isLoading ? (
          <div className="loading-state">
            <LoaderCircle className="spin" size={28} />
            <h2>Carregando as 643 seções…</h2>
          </div>
        ) : query.isError ? (
          <div className="loading-state">
            <h2>Não foi possível carregar os dados.</h2>
            <button onClick={() => query.refetch()}>Tentar novamente</button>
          </div>
        ) : (
          <>
            <div className="result-context">
              <span>
                {hasFilters
                  ? `${number(filtered.length)} seções no filtro atual`
                  : "Brasil · 643 seções selecionadas"}
              </span>
              {hasFilters && (
                <button onClick={clear}>
                  Ver todo o Brasil <ArrowUpRight size={13} />
                </button>
              )}
            </div>
            <div className="explorer-grid">
              <ElectionMap sections={filtered} selected={selected} onCity={selectFromMap} />
              <SectionDetail section={selected} candidates={query.data?.candidates ?? []} />
            </div>
            <SectionTable
              sections={filtered}
              selected={selected}
              onSelect={(s) => {
                setSelectedId(s.id);
                if (window.innerWidth < 900)
                  document
                    .querySelector(".detail-panel")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
          </>
        )}
        <div className="disclaimer">
          <Info size={17} />
          <p>
            <strong>Um recorte para consulta, não uma conclusão.</strong> As seções foram
            selecionadas pela votação do 2º turno. Preferências locais podem ser homogêneas; estes
            dados não demonstram irregularidade. Os links do TSE abrem os totais da zona.
          </p>
          <button onClick={() => setMethod(true)}>
            Entenda o método <ArrowUpRight size={14} />
          </button>
        </div>
      </main>
      <footer>
        <span>
          mapaeleitoral <span>· Consulta às eleições de 2026</span>
        </span>
        <span>Dados: TSE · Mapa: OpenStreetMap</span>
      </footer>
      {method && (
        <dialog
          className="method-modal"
          aria-modal="true"
          aria-labelledby="method-title"
          ref={(element) => {
            if (element && !element.open) element.showModal();
          }}
          onCancel={() => setMethod(false)}
        >
          <button
            className="modal-close"
            onClick={() => setMethod(false)}
            aria-label="Fechar informações"
          >
            <X size={20} />
          </button>
          <span className="eyebrow">TRANSPARÊNCIA</span>
          <h2 id="method-title">Sobre este recorte</h2>
          <p>
            Foram examinadas <strong>497.897 seções</strong> dos 26 estados e do Distrito Federal,
            na base oficial do TSE para presidente em 2026.
          </p>
          <h3>Como as 643 seções foram escolhidas?</h3>
          <p>
            No 2º turno, um candidato teve <strong>até 5 votos</strong> e o outro teve{" "}
            <strong>pelo menos 100</strong>. A seleção não foi reaplicada ao 1º turno: as mesmas
            cidades, zonas e seções foram preservadas. São 627 casos com Flavio até 5 votos e 16 com
            Lula até 5.
          </p>
          <h3>Como consultar os dados?</h3>
          <p>
            O mapa usa uma coordenada aproximada do município, não do local de votação. Clique em um
            município e escolha sua seção. Os links oficiais de cada turno abrem o{" "}
            <strong>total da zona</strong>. O resultado individual da seção vem do CSV oficial, não
            daquela página agregada.
          </p>
          <h3>Fontes e limites</h3>
          <p>
            Geração da base: {query.data?.generation ?? "26/10/2026 12:07:25"}. Os votos e a
            cobertura do 2º turno foram conciliados com o total de cada UF; os totais nacionais do
            1º turno também conferem. Os percentuais usam todos os votos válidos do respectivo
            turno. Não foram auditados boletins de urna ou logs individuais.
          </p>
          <div className="source-links">
            <a
              href="https://dadosabertos.tse.jus.br/dataset/resultados-2026"
              target="_blank"
              rel="noopener noreferrer"
            >
              Dados Abertos TSE <ExternalSource />
            </a>
            <a
              href="https://cdn.tse.jus.br/estatistica/sead/odsele/votacao_secao/votacao_secao_2026_BR.zip"
              target="_blank"
              rel="noopener noreferrer"
            >
              CSV oficial por seção <ExternalSource />
            </a>
            <a
              href="https://github.com/kelvins/municipios-brasileiros"
              target="_blank"
              rel="noopener noreferrer"
            >
              Coordenadas municipais <ExternalSource />
            </a>
          </div>
          <p className="modal-note">
            Painel independente, sem vínculo com o TSE. O filtro descreve padrões de votação, não
            identifica fraude nem transferências individuais de votos.
          </p>
        </dialog>
      )}
    </div>
  );
}
function ExternalSource() {
  return <ArrowUpRight size={14} />;
}
