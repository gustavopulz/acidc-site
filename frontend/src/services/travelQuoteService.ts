/**
 * Cálculo de deslocamento — Nominatim (geocoding) + OSRM Route API (roteamento)
 *
 * Nominatim: https://nominatim.openstreetmap.org
 * OSRM:      https://router.project-osrm.org
 *
 * Rotas da banda:
 *   V1 (Araras):   Araras → Limeira → destino → Limeira → Araras
 *   V2 (Limeira):  Limeira → destino → Limeira
 *   V3 (Valinhos): Valinhos → destino → Valinhos
 *
 * Geocoding — estratégia em cascata (2 tentativas):
 *   1. Parâmetros estruturados: city + state + country  (mais preciso)
 *   2. Free-form com nome completo do estado             (fallback)
 * O nome completo do estado (ex: "São Paulo") é sempre usado — a sigla "SP"
 * não é reconhecida de forma confiável pelo Nominatim.
 */

import { quoteConfig, ESTADOS_BR } from "../config/quoteConfig";

export interface TravelQuoteResult {
  price: number | null;
  note: string;
}

interface GeoPoint {
  lat: number;
  lng: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function calcTravelCost(distLimeiraKm: number, distValinhosKm: number): number {
  const {
    fuelPrice, vehicleConsumption, vehicleWearPerKm,
    safetyMarginPercentage, minimumTravelPrice, roundingStep,
    fixedArarasLimeiraKm, tollEstimateTotal,
  } = quoteConfig;

  const v1Km = 2 * fixedArarasLimeiraKm + 2 * distLimeiraKm;
  const v2Km = 2 * distLimeiraKm;
  const v3Km = 2 * distValinhosKm;

  const fuelCost =
    (v1Km / vehicleConsumption.araras) * fuelPrice +
    (v2Km / vehicleConsumption.limeira) * fuelPrice +
    (v3Km / vehicleConsumption.valinhos) * fuelPrice;

  const wearCost = (v1Km + v2Km + v3Km) * vehicleWearPerKm;
  const subtotal = fuelCost + wearCost + tollEstimateTotal;
  const withMargin = subtotal * (1 + safetyMarginPercentage / 100);

  return roundUp(Math.max(withMargin, minimumTravelPrice), roundingStep);
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

// ─── Nominatim geocoding ──────────────────────────────────────────────────────

async function tryNominatim(
  params: Record<string, string>,
): Promise<GeoPoint | null> {
  const base: Record<string, string> = {
    format: "json",
    limit: "1",
    countrycodes: "br",
    "accept-language": "pt-BR,pt",
  };

  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(
    { ...base, ...params },
  )}`;

  try {
    const res = await fetchWithTimeout(url, 5000);
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

async function geocodeAddress(
  rua: string,
  cidade: string,
  estado: string,
): Promise<GeoPoint | null> {
  const estadoNome =
    ESTADOS_BR.find((e) => e.uf === estado)?.nome ?? estado;

  // ── Tentativa 1: parâmetros estruturados city + state
  //    (Nominatim faz matching exato e é mais confiável para municípios brasileiros)
  {
    const params: Record<string, string> = {
      city: cidade,
      state: estadoNome,
      country: "Brazil",
    };
    // Inclui rua apenas quando ela foi informada
    if (rua) params.street = rua;

    const r = await tryNominatim(params);
    if (r) return r;
  }

  // Aguarda para respeitar o limite de 1 req/s do Nominatim
  await sleep(1100);

  // ── Tentativa 2: free-form sem rua (fallback para nomes que diferem do OSM)
  const r2 = await tryNominatim({ q: `${cidade}, ${estadoNome}` });
  return r2;
}

// ─── OSRM routing ─────────────────────────────────────────────────────────────

async function getRoadDistanceKm(
  origin: GeoPoint,
  dest: GeoPoint,
): Promise<number | null> {
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=false`;

  try {
    const res = await fetchWithTimeout(url, 10000);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      routes?: Array<{ distance: number }>;
    };
    if (!data.routes?.length) return null;
    return data.routes[0].distance / 1000;
  } catch {
    return null;
  }
}

// ─── public API ───────────────────────────────────────────────────────────────

export async function calculateTravelQuote(input: {
  rua: string;
  cidade: string;
  estado: string;
}): Promise<TravelQuoteResult> {
  const { rua, cidade, estado } = input;

  if (!cidade || !estado) {
    return {
      price: null,
      note: "Informe a cidade e o estado para calcular o deslocamento.",
    };
  }

  const dest = await geocodeAddress(rua, cidade, estado);
  if (!dest) {
    return {
      price: null,
      note: "Não foi possível localizar a cidade. O deslocamento será calculado no orçamento.",
    };
  }

  const { vehicleOrigins } = quoteConfig;

  const [distLimeira, distValinhos] = await Promise.all([
    getRoadDistanceKm(
      { lat: vehicleOrigins.limeira.lat, lng: vehicleOrigins.limeira.lng },
      dest,
    ),
    getRoadDistanceKm(
      { lat: vehicleOrigins.valinhos.lat, lng: vehicleOrigins.valinhos.lng },
      dest,
    ),
  ]);

  if (distLimeira === null || distValinhos === null) {
    return {
      price: null,
      note: "Não foi possível calcular a rota. O deslocamento será calculado manualmente.",
    };
  }

  return { price: calcTravelCost(distLimeira, distValinhos), note: "" };
}
