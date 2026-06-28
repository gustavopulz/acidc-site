import { useRef, useState, useEffect } from "react";
import Section from "../components/Section";
import ShowPackageCard from "../components/quote/ShowPackageCard";
import QuoteForm from "../components/quote/QuoteForm";
import QuoteSummary from "../components/quote/QuoteSummary";
import type { PackageId, QuoteFormData, QuoteFormErrors } from "../types/quote";
import type { TravelQuoteResult } from "../services/travelQuoteService";
import { SHOW_PACKAGES } from "../config/quoteConfig";
import { calculateTravelQuote } from "../services/travelQuoteService";

const EMPTY_FORM: QuoteFormData = {
  pacote: "",
  data: "",
  hora: "",
  estado: "",
  cidade: "",
  rua: "",
  pessoas: "",
  ambiente: "",
  precisaSom: "",
};

const INITIAL_TRAVEL: TravelQuoteResult = {
  price: null,
  note: "Informe a cidade para calcular o deslocamento.",
};

export default function Quote() {
  const formAnchorRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<QuoteFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [travelResult, setTravelResult] = useState<TravelQuoteResult>(INITIAL_TRAVEL);
  const [travelLoading, setTravelLoading] = useState(false);

  const selectedPackage =
    form.pacote && form.pacote !== "personalizado"
      ? (SHOW_PACKAGES.find((p) => p.id === form.pacote) ?? null)
      : null;

  // Recalculate travel when location changes (debounced)
  useEffect(() => {
    if (!form.cidade || !form.estado) {
      setTravelResult({
        price: null,
        note: "Informe a cidade e o estado para calcular o deslocamento.",
      });
      return;
    }

    setTravelLoading(true);
    const timer = setTimeout(async () => {
      const result = await calculateTravelQuote({
        rua: form.rua,
        cidade: form.cidade,
        estado: form.estado,
      });
      setTravelResult(result);
      setTravelLoading(false);
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [form.rua, form.cidade, form.estado]);

  function scrollToForm() {
    formAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handlePackageSelect(id: PackageId) {
    setForm((prev) => ({ ...prev, pacote: id }));
    setErrors((prev) => ({ ...prev, pacote: undefined }));
    scrollToForm();
  }

  function handleChange(field: keyof QuoteFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const showSummary = form.pacote !== "";

  return (
    <>
      {/* Hero */}
      <div className="relative py-20 sm:py-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-accent-900/25 via-black/0 to-transparent" />
        <div className="absolute inset-0 -z-10 opacity-30" aria-hidden>
          <div className="h-full w-full bg-grid bg-[size:32px_32px]" />
        </div>
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-ember to-white">
              Contrate o show da ACID/C
            </span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
            Leve a energia dos clássicos do AC/DC para o seu evento. Escolha o
            formato do show e solicite uma estimativa personalizada.
          </p>
          <div className="mt-8">
            <button
              type="button"
              onClick={scrollToForm}
              className="inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition bg-accent-600 text-white hover:bg-accent-500 shadow-glow focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              Calcular orçamento
            </button>
          </div>
        </div>
      </div>

      {/* Pacotes */}
      <Section id="pacotes" title="Pacotes de show">
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2 pt-4"
          role="radiogroup"
          aria-label="Escolha o pacote de show"
        >
          {SHOW_PACKAGES.map((pkg) => (
            <ShowPackageCard
              key={pkg.id}
              pkg={pkg}
              selected={form.pacote === pkg.id}
              onSelect={handlePackageSelect}
            />
          ))}
        </div>
      </Section>

      {/* Sonorização */}
      <Section>
        <div className="rounded-lg border border-white/10 bg-white/5 p-5 max-w-2xl">
          <h2 className="font-semibold text-white mb-2">Sonorização</h2>
          <p className="text-white/70 text-sm">
            Sonorização compacta para eventos em ambientes fechados com até 100 pessoas:{" "}
            <strong className="text-accent-400 font-semibold">R$ 800 adicionais</strong>.
          </p>
          <p className="text-white/50 text-sm mt-2">
            Para ambientes externos ou eventos com mais de 100 pessoas, a estrutura de
            som será avaliada separadamente.
          </p>
        </div>
      </Section>

      {/* Âncora de scroll */}
      <div ref={formAnchorRef} className="scroll-mt-24" />

      {/* Formulário */}
      <Section title="Calcule sua estimativa">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <QuoteForm form={form} errors={errors} onChange={handleChange} />
          {showSummary && (
            <QuoteSummary
              form={form}
              selectedPackage={selectedPackage}
              travelResult={travelResult}
              travelLoading={travelLoading}
            />
          )}
        </div>
      </Section>
    </>
  );
}
