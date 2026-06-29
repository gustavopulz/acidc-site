import type { ShowPackage } from "../types/quote";

export const WHATSAPP_NUMBER = "5519997404451";

export const quoteConfig = {
  fuelPrice: 6.6,
  vehicleConsumption: {
    araras: 10,
    limeira: 10,
    valinhos: 10,
  },
  vehicleWearPerKm: 0.3,
  safetyMarginPercentage: 10,
  minimumTravelPrice: 150,
  roundingStep: 50,
  soundFlatPrice: 600,
  // Distância fixa Araras ↔ Limeira (km por estrada — nunca muda)
  fixedArarasLimeiraKm: 23,
  // Pedágios estimados — total para todos os veículos (R$). Ajustar conforme rota.
  tollEstimateTotal: 0,
  // Coordenadas fixas das origens (lon/lat para OSRM)
  vehicleOrigins: {
    limeira: { lat: -22.5642, lng: -47.4019 },
    valinhos: { lat: -22.9706, lng: -46.9963 },
  },
} as const;

export const SHOW_PACKAGES: ShowPackage[] = [
  {
    id: "essencial",
    name: "Show Essencial",
    duration: "1h30",
    basePrice: 2000,
    description:
      "Uma apresentação direta e intensa, reunindo os principais clássicos do AC/DC.",
  },
  {
    id: "completo",
    name: "Show Completo",
    duration: "2 horas",
    basePrice: 2500,
    description:
      "Mais músicas no repertório e uma experiência completa para o público.",
    highlighted: true,
    badge: "Mais escolhido",
  },
  {
    id: "estendido",
    name: "Show Estendido",
    duration: "2h30",
    basePrice: 3000,
    description:
      "Nosso formato mais completo, indicado para eventos que desejam uma apresentação de longa duração.",
  },
];

export const ALL_PACKAGES: ShowPackage[] = [
  ...SHOW_PACKAGES,
  {
    id: "personalizado",
    name: "Orçamento personalizado",
    duration: "A combinar",
    basePrice: null,
    description: "Entre em contato para um orçamento sob medida para o seu evento.",
  },
];

export const ESTADOS_BR: { uf: string; nome: string }[] = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

export const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const brlCompact = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
