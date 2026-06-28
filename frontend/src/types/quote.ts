export type PackageId = "essencial" | "completo" | "estendido" | "personalizado";
export type AmbienteType = "interno" | "externo";
export type SomType = "sim" | "nao";

export interface ShowPackage {
  id: PackageId;
  name: string;
  duration: string;
  basePrice: number | null;
  description: string;
  highlighted?: boolean;
  badge?: string;
}

export interface QuoteFormData {
  pacote: PackageId | "";
  data: string;       // "2026-08-10"
  hora: string;       // "19:00"
  estado: string;     // UF "SP"
  cidade: string;
  rua: string;        // street address
  pessoas: string;
  ambiente: AmbienteType | "";
  precisaSom: SomType | "";
}

export type QuoteFormErrors = Partial<Record<keyof QuoteFormData, string>>;
