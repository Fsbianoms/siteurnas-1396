import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize, MapPin } from "lucide-react";
import type { ElectionSection } from "../../../shared/election";
import { cityKey, number } from "../../lib/election";

type Props = {
  sections: ElectionSection[];
  selected: ElectionSection | null;
  onCity: (section: ElectionSection) => void;
};
function Fit({ points, reset }: { points: ElectionSection[]; reset: number }) {
  const map = useMap();
  useEffect(() => {
    if (!points.length) return;
    const bounds = L.latLngBounds(points.map((s) => [s.lat, s.lng] as [number, number]));
    map.fitBounds(bounds, {
      padding: [38, 38],
      maxZoom: points.length === 1 ? 9 : 6,
      animate: false,
    });
  }, [map, points, reset]);
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}
export function ElectionMap({ sections, selected, onCity }: Props) {
  const [reset, setReset] = useState(0);
  const [tileErrors, setTileErrors] = useState(0);
  const points = useMemo(() => {
    const groups = new Map<string, { section: ElectionSection; count: number; mixed: boolean }>();
    for (const s of sections) {
      const existing = groups.get(cityKey(s));
      if (existing) {
        existing.count++;
        existing.mixed ||= existing.section.lowCandidate !== s.lowCandidate;
      } else groups.set(cityKey(s), { section: s, count: 1, mixed: false });
    }
    return [...groups.values()];
  }, [sections]);
  const pointSections = useMemo(() => points.map((p) => p.section), [points]);
  return (
    <section className="map-panel" aria-label="Mapa dos municípios com seções selecionadas">
      <div className="panel-heading">
        <div>
          <MapPin size={17} />
          <h2>Onde estão as seções</h2>
        </div>
        <span>{number(points.length)} municípios</span>
      </div>
      <div className="map-canvas">
        <MapContainer
          center={[-12.5, -53]}
          zoom={4}
          minZoom={3}
          maxZoom={13}
          scrollWheelZoom={false}
          zoomControl={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
            eventHandlers={{ tileerror: () => setTileErrors((n) => n + 1) }}
          />
          <Fit points={pointSections} reset={reset} />
          {points.map(({ section: s, count, mixed }) => {
            const active = selected && cityKey(selected) === cityKey(s);
            return (
              <CircleMarker
                key={cityKey(s)}
                center={[s.lat, s.lng]}
                radius={(active ? 10 : 5) + Math.min(Math.log2(count + 1), 4)}
                pathOptions={{
                  color: "#ffffff",
                  weight: active ? 3 : 1.5,
                  fillColor: mixed ? "#52677b" : s.lowCandidate === "lula" ? "#b6853e" : "#237b5a",
                  fillOpacity: active ? 1 : 0.85,
                }}
                eventHandlers={{ click: () => onCity(s) }}
              >
                <Tooltip direction="top">
                  <strong>
                    {s.city}, {s.uf}
                  </strong>
                  <br />
                  {count} {count === 1 ? "seção selecionada" : "seções selecionadas"}
                  <br />
                  Clique para explorar
                </Tooltip>
              </CircleMarker>
            );
          })}
        </MapContainer>
        <button
          className="map-reset"
          onClick={() => setReset((n) => n + 1)}
          title="Enquadrar municípios filtrados"
          aria-label="Enquadrar municípios filtrados"
        >
          <Maximize size={16} />
        </button>
        {!sections.length && <div className="map-empty">Nenhuma seção neste filtro.</div>}
        {tileErrors > 8 && (
          <div className="map-warning">
            Mapa-base indisponível. Os pontos e a tabela continuam disponíveis.
          </div>
        )}
      </div>
      <div className="map-bottom">
        <span>
          <i className="dot green" />
          Flavio com até 5 votos
        </span>
        <span>
          <i className="dot amber" />
          Lula com até 5 votos
        </span>
        <span>
          <i className="dot mixed" />
          Ambos os tipos
        </span>
      </div>
      <p className="map-note">
        Pontos aproximados dos municípios, não dos locais de votação. Clique em um ponto para
        filtrar.
      </p>
    </section>
  );
}
