export type ElectionSection = {
  id: string;
  uf: string;
  state: string;
  city: string;
  cityCode: number;
  zone: number;
  section: number;
  localCode: number;
  local: string;
  address: string;
  lat: number;
  lng: number;
  first: Record<string, number>;
  second: { lula: number; flavio: number; blank: number; null: number };
  validFirst: number;
  totalFirst: number;
  lowCandidate: 'lula' | 'flavio';
};
export type ElectionCandidate = { number: number; name: string; fullName: string };
export type ElectionData = {
  sections: ElectionSection[];
  candidates: ElectionCandidate[];
  generation: string;
  examined: number;
  states: Record<string, string>;
};