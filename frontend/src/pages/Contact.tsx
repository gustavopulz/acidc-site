import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import Section from "../components/Section";
import { WHATSAPP_NUMBER, brl, brlCompact, ESTADOS_BR, ALL_PACKAGES } from "../config/quoteConfig";
import { useCidades } from "../hooks/useCidades";
import SearchableSelect, { type SelectOption } from "../components/quote/SearchableSelect";
import DateTimePicker from "../components/quote/DateTimePicker";
import { cn } from "../lib/cn";

type FormMode = "orcamento" | "contato";

type PacoteValue =
  | "essencial"
  | "completo"
  | "estendido"
  | "personalizado"
  | "nao-definido"
  | "";

interface ContactForm {
  pacote: PacoteValue;
  data: string;
  hora: string;
  estado: string;
  cidade: string;
  rua: string;
  pessoas: string;
  ambiente: "interno" | "externo" | "";
  precisaSom: "sim" | "nao" | "";
  estimativa: string;
  deslocamento: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
}

interface ContactErrors {
  nome?: string;
  email?: string;
}

const PACOTE_LABELS: Record<string, string> = {
  essencial: "Show Essencial — 1h30",
  completo: "Show Completo — 2 horas",
  estendido: "Show Estendido — 2h30",
  personalizado: "Orçamento personalizado",
  "nao-definido": "Ainda não definido",
};

const ESTADO_OPTIONS: SelectOption[] = ESTADOS_BR.map((e) => ({
  value: e.uf,
  label: e.nome,
}));

function formatDateBr(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function buildShowMessage(f: ContactForm): string {
  const isPersonalizado = f.pacote === "personalizado" || f.pacote === "nao-definido";

  const lines: string[] = [
    isPersonalizado
      ? "🎸 *Solicitação de orçamento personalizado — ACID/C*"
      : "🎸 *Solicitação de orçamento — ACID/C*",
    "",
  ];

  if (f.pacote) lines.push(`📦 *Pacote:* ${PACOTE_LABELS[f.pacote] ?? f.pacote}`);

  if (f.data) {
    const horaFmt = f.hora ? ` às ${f.hora.replace(":", "h")}` : "";
    lines.push(`📅 *Data do evento:* ${formatDateBr(f.data)}${horaFmt}`);
  }

  const localidade = [f.cidade, f.estado].filter(Boolean).join("/");
  if (localidade) lines.push(`🏙️ *Cidade/Estado:* ${localidade}`);
  if (f.rua) lines.push(`📍 *Endereço:* ${f.rua}`);
  if (f.pessoas) lines.push(`👥 *Público estimado:* ${f.pessoas} pessoas`);
  if (f.ambiente) lines.push(`🏠 *Ambiente:* ${f.ambiente === "interno" ? "Interno" : "Externo"}`);
  if (f.precisaSom) lines.push(`🎵 *Equipamento de som:* ${f.precisaSom === "sim" ? "Sim" : "Não"}`);

  const deslocVal = parseFloat(f.deslocamento);
  if (!isNaN(deslocVal)) lines.push(`🚗 *Deslocamento estimado:* ${brl.format(deslocVal)}`);

  const estimVal = parseFloat(f.estimativa);
  if (!isNaN(estimVal)) lines.push(`💰 *Total estimado pelo site:* ${brl.format(estimVal)}`);

  lines.push("");
  lines.push(`👤 *Nome:* ${f.nome}`);
  lines.push(`📧 *E-mail:* ${f.email}`);
  if (f.telefone) lines.push(`📱 *Telefone:* ${f.telefone}`);
  if (f.mensagem) lines.push(`\n📝 *Observações:*\n${f.mensagem}`);
  lines.push("");
  lines.push(
    isPersonalizado
      ? "Podem entrar em contato para alinharmos os detalhes?"
      : "Gostaria de confirmar a disponibilidade e receber o orçamento final."
  );

  return lines.join("\n");
}

function buildContactMessage(f: ContactForm): string {
  const lines: string[] = ["👋 *Olá, ACID/C!*", ""];

  lines.push(`👤 *Nome:* ${f.nome}`);
  lines.push(`📧 *E-mail:* ${f.email}`);
  if (f.telefone) lines.push(`📱 *Telefone:* ${f.telefone}`);

  if (f.mensagem) {
    lines.push("");
    lines.push(`📝 *Mensagem:*\n${f.mensagem}`);
  }

  return lines.join("\n");
}

function formatPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const INPUT = "w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition";
const LABEL = "block text-sm mb-1";
const ERR_CLS = "mt-1 text-xs text-red-400";

function hasShowParams(sp: URLSearchParams): boolean {
  return (
    sp.has("pacote") ||
    sp.has("assunto") ||
    sp.has("data") ||
    sp.has("cidade") ||
    sp.has("estimativa")
  );
}

export default function Contact() {
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState<FormMode>(() =>
    hasShowParams(searchParams) ? "orcamento" : "contato"
  );

  const [form, setForm] = useState<ContactForm>(() => ({
    pacote: (searchParams.get("pacote") ?? "") as PacoteValue,
    data: searchParams.get("data") ?? "",
    hora: searchParams.get("hora") ?? "",
    estado: searchParams.get("estado") ?? "",
    cidade: searchParams.get("cidade") ?? "",
    rua: searchParams.get("rua") ?? "",
    pessoas: searchParams.get("pessoas") ?? "",
    ambiente: (searchParams.get("ambiente") ?? "") as ContactForm["ambiente"],
    precisaSom: (searchParams.get("som") ?? "") as ContactForm["precisaSom"],
    estimativa: searchParams.get("estimativa") ?? "",
    deslocamento: searchParams.get("deslocamento") ?? "",
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  }));

  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);

  const { cidades, loading: cidadesLoading } = useCidades(form.estado);
  const cidadeOptions: SelectOption[] = cidades.map((c) => ({ value: c, label: c }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in errors) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  function validate(): boolean {
    const errs: ContactErrors = {};
    if (!form.nome.trim()) errs.nome = "Nome é obrigatório.";
    if (!form.email.trim()) {
      errs.email = "E-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "E-mail inválido.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const message =
      mode === "orcamento" ? buildShowMessage(form) : buildContactMessage(form);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    setWaUrl(url);
    window.open(url, "_blank");
    setSent(true);
  };

  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 8000);
    return () => clearTimeout(t);
  }, [sent]);

  const estimVal = parseFloat(form.estimativa);
  const deslocVal = parseFloat(form.deslocamento);

  return (
    <Section
      title={mode === "orcamento" ? "Contato para shows" : "Fale conosco"}
      subtitle={
        mode === "orcamento"
          ? "Envie os detalhes do seu evento que retornamos em breve."
          : "Envie uma mensagem e retornamos em breve."
      }
    >
      <div className="grid gap-6 max-w-2xl">
        {/* Mode selector */}
        <div className="flex rounded-lg border border-white/10 bg-white/5 p-1 gap-1">
          <button
            type="button"
            onClick={() => setMode("orcamento")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-semibold rounded-md transition",
              mode === "orcamento"
                ? "bg-accent-600 text-white shadow-glow"
                : "text-white/50 hover:text-white hover:bg-white/10"
            )}
          >
            Solicitar Orçamento
          </button>
          <button
            type="button"
            onClick={() => setMode("contato")}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-semibold rounded-md transition",
              mode === "contato"
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white hover:bg-white/10"
            )}
          >
            Entrar em Contato
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="grid gap-6">
          {/* Show fields — only in orcamento mode */}
          {mode === "orcamento" && (
            <>
              {/* Estimativa do site */}
              {(!isNaN(estimVal) || !isNaN(deslocVal)) && (form.estimativa || form.deslocamento) && (
                <div className="rounded-md border border-accent-500/30 bg-accent-900/10 px-4 py-3 flex flex-wrap gap-4">
                  {!isNaN(deslocVal) && form.deslocamento && (
                    <div>
                      <span className="text-xs text-white/50 block">Deslocamento estimado</span>
                      <span className="font-bold text-accent-400">{brl.format(deslocVal)}</span>
                    </div>
                  )}
                  {!isNaN(estimVal) && form.estimativa && (
                    <div>
                      <span className="text-xs text-white/50 block">Total estimado pelo site</span>
                      <span className="font-bold text-accent-400">{brl.format(estimVal)}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Pacote */}
              <div>
                <label htmlFor="c-pacote" className={LABEL}>Pacote de show</label>
                <select
                  id="c-pacote"
                  name="pacote"
                  value={form.pacote}
                  onChange={handleChange}
                  className={INPUT}
                >
                  <option value="">Selecione um pacote</option>
                  {ALL_PACKAGES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {p.basePrice !== null
                        ? ` — ${p.duration} — a partir de ${brlCompact.format(p.basePrice)}`
                        : ` — ${p.duration}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Data e hora */}
              <div>
                <label htmlFor="c-data" className={LABEL}>Data e horário do evento</label>
                <DateTimePicker
                  id="c-data"
                  dateValue={form.data}
                  timeValue={form.hora}
                  onDateChange={(v) => setForm((prev) => ({ ...prev, data: v }))}
                  onTimeChange={(v) => setForm((prev) => ({ ...prev, hora: v }))}
                />
              </div>

              {/* Estado */}
              <div>
                <label htmlFor="c-estado" className={LABEL}>Estado</label>
                <SearchableSelect
                  id="c-estado"
                  value={form.estado}
                  onChange={(val) => setForm((prev) => ({ ...prev, estado: val, cidade: "" }))}
                  options={ESTADO_OPTIONS}
                  placeholder="Selecione o estado"
                />
              </div>

              {/* Cidade */}
              <div>
                <label htmlFor="c-cidade" className={LABEL}>Cidade</label>
                <SearchableSelect
                  id="c-cidade"
                  value={form.cidade}
                  onChange={(val) => setForm((prev) => ({ ...prev, cidade: val }))}
                  options={cidadeOptions}
                  placeholder={
                    !form.estado
                      ? "Selecione o estado primeiro"
                      : cidadesLoading
                      ? "Carregando cidades…"
                      : "Selecione a cidade"
                  }
                  disabled={!form.estado || cidadesLoading}
                />
              </div>

              {/* Rua */}
              <div>
                <label htmlFor="c-rua" className={LABEL}>Rua / Endereço do evento</label>
                <input
                  id="c-rua"
                  type="text"
                  name="rua"
                  value={form.rua}
                  onChange={handleChange}
                  placeholder="Ex: Rua das Flores, 123"
                  className={INPUT}
                />
              </div>

              {/* Público + Ambiente + Som */}
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <label htmlFor="c-pessoas" className={LABEL}>Público estimado</label>
                  <input
                    id="c-pessoas"
                    type="number"
                    min={1}
                    name="pessoas"
                    value={form.pessoas}
                    onChange={handleChange}
                    placeholder="100"
                    className={INPUT}
                  />
                </div>
                <div>
                  <label htmlFor="c-ambiente" className={LABEL}>Tipo de ambiente</label>
                  <select
                    id="c-ambiente"
                    name="ambiente"
                    value={form.ambiente}
                    onChange={handleChange}
                    className={INPUT}
                  >
                    <option value="">Selecione</option>
                    <option value="interno">Interno</option>
                    <option value="externo">Externo</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="c-som" className={LABEL}>Precisa de som?</label>
                  <select
                    id="c-som"
                    name="precisaSom"
                    value={form.precisaSom}
                    onChange={handleChange}
                    className={INPUT}
                  >
                    <option value="">Selecione</option>
                    <option value="sim">Sim</option>
                    <option value="nao">Não</option>
                  </select>
                </div>
              </div>

              <hr className="border-white/10" />
            </>
          )}

          {/* Campos pessoais — sempre visíveis */}
          <div>
            <label htmlFor="c-nome" className={LABEL}>
              Nome <span className="text-accent-400">*</span>
            </label>
            <input
              id="c-nome"
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Seu nome"
              className={cn(INPUT, errors.nome && "border-red-500/60")}
              required
            />
            {errors.nome && <p className={ERR_CLS}>{errors.nome}</p>}
          </div>

          <div>
            <label htmlFor="c-email" className={LABEL}>
              E-mail <span className="text-accent-400">*</span>
            </label>
            <input
              id="c-email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="voce@exemplo.com"
              className={cn(INPUT, errors.email && "border-red-500/60")}
              required
            />
            {errors.email && <p className={ERR_CLS}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="c-telefone" className={LABEL}>Telefone</label>
            <input
              id="c-telefone"
              type="tel"
              name="telefone"
              value={form.telefone}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, telefone: formatPhone(e.target.value) }))
              }
              placeholder="(19) 99999-9999"
              className={INPUT}
            />
          </div>

          <div>
            <label htmlFor="c-mensagem" className={LABEL}>
              {mode === "orcamento" ? "Observações adicionais" : "Mensagem"}
            </label>
            <textarea
              id="c-mensagem"
              name="mensagem"
              value={form.mensagem}
              onChange={handleChange}
              className={cn(INPUT, "min-h-[120px]")}
              placeholder={
                mode === "orcamento"
                  ? "Conte-nos mais sobre o evento…"
                  : "Como podemos ajudar?"
              }
            />
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-accent-600 hover:bg-accent-500 shadow-glow transition focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              Enviar via WhatsApp
            </button>

            {sent && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-start justify-between gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <p className="text-sm">
                    Pronto! Abrimos o WhatsApp com sua mensagem.{" "}
                    {waUrl && (
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-emerald-400/60 underline-offset-4 hover:no-underline"
                      >
                        Abrir novamente
                      </a>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  aria-label="Fechar aviso"
                  className="text-emerald-200/80 transition-colors hover:text-emerald-100"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </Section>
  );
}
