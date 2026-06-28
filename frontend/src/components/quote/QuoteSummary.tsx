import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import type { QuoteFormData, ShowPackage } from "../../types/quote";
import type { TravelQuoteResult } from "../../services/travelQuoteService";
import { quoteConfig, brl } from "../../config/quoteConfig";

interface Props {
  form: QuoteFormData;
  selectedPackage: ShowPackage | null;
  travelResult: TravelQuoteResult;
  travelLoading: boolean;
}

function getSoundResult(form: QuoteFormData): { price: number | null; note: string | null } {
  if (form.precisaSom !== "sim") return { price: null, note: null };

  const pessoas = parseInt(form.pessoas, 10);
  const canAutoPrice =
    form.ambiente === "interno" &&
    !isNaN(pessoas) &&
    pessoas > 0 &&
    pessoas <= quoteConfig.soundMaxPeople;

  if (canAutoPrice) return { price: quoteConfig.soundFlatPrice, note: null };

  return {
    price: null,
    note: "A estrutura de som será calculada em um orçamento personalizado.",
  };
}

function buildContactUrl(form: QuoteFormData, total: number | null, travelResult: TravelQuoteResult): string {
  const p = new URLSearchParams();
  p.set("assunto", "show");
  if (form.pacote) p.set("pacote", form.pacote);
  if (form.data) p.set("data", form.data);
  if (form.hora) p.set("hora", form.hora);
  if (form.estado) p.set("estado", form.estado);
  if (form.cidade) p.set("cidade", form.cidade);
  if (form.rua) p.set("rua", form.rua);
  if (form.pessoas) p.set("pessoas", form.pessoas);
  if (form.ambiente) p.set("ambiente", form.ambiente);
  if (form.precisaSom) p.set("som", form.precisaSom);
  if (travelResult.price !== null) p.set("deslocamento", String(travelResult.price));
  if (total !== null) p.set("estimativa", String(total));
  return `/contato?${p.toString()}`;
}

export default function QuoteSummary({ form, selectedPackage, travelResult, travelLoading }: Props) {
  const isPersonalizado = form.pacote === "personalizado";
  const sound = getSoundResult(form);

  const showPrice = selectedPackage?.basePrice ?? null;
  const soundPrice = sound.price;
  const travelPrice = travelResult.price;

  const hasFullTotal = !isPersonalizado && showPrice !== null;
  const total = hasFullTotal
    ? showPrice + (soundPrice ?? 0) + (travelPrice ?? 0)
    : null;

  const contactUrl = buildContactUrl(form, total, travelResult);

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6 flex flex-col gap-5 sticky top-24">
      <h3 className="text-lg font-bold text-white">Resumo do orçamento</h3>

      <dl className="flex flex-col gap-3 text-sm">
        {/* Show */}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-white/60 shrink-0">Show</dt>
          <dd className="text-white font-medium text-right">
            {isPersonalizado ? (
              <span className="text-white/60 italic">Orçamento personalizado</span>
            ) : selectedPackage ? (
              <>
                <span className="block text-xs text-white/60">{selectedPackage.name}</span>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-ember">
                  {brl.format(selectedPackage.basePrice!)}
                </span>
              </>
            ) : (
              "—"
            )}
          </dd>
        </div>

        {/* Sonorização */}
        {form.precisaSom === "sim" && (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-white/60 shrink-0">Sonorização</dt>
            <dd className="text-right">
              {soundPrice !== null ? (
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-ember">
                  {brl.format(soundPrice)}
                </span>
              ) : (
                <span className="text-white/50 italic text-xs max-w-[180px] leading-relaxed block">
                  {sound.note}
                </span>
              )}
            </dd>
          </div>
        )}

        {/* Deslocamento */}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-white/60 shrink-0">Deslocamento</dt>
          <dd className="text-right">
            {travelLoading ? (
              <span className="text-white/50 italic text-xs animate-pulse">
                Calculando rota…
              </span>
            ) : travelPrice !== null ? (
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-ember">
                {brl.format(travelPrice)}
              </span>
            ) : (
              <span className="text-white/50 italic text-xs max-w-[200px] leading-relaxed block">
                {travelResult.note}
              </span>
            )}
          </dd>
        </div>

        {/* Divisor + total */}
        {total !== null && (
          <>
            <div className="border-t border-white/10 my-1" />
            <div className="flex items-center justify-between gap-4">
              <dt className="font-semibold text-white">
                Total estimado
                {travelPrice === null && (
                  <span className="text-white/40 text-xs font-normal block">
                    (sem deslocamento)
                  </span>
                )}
              </dt>
              <dd className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-ember">
                {brl.format(total)}
              </dd>
            </div>
          </>
        )}
      </dl>

      <p className="text-xs text-white/40 leading-relaxed border-t border-white/10 pt-4">
        Este valor é uma estimativa e está sujeito à confirmação de disponibilidade,
        estrutura, horário, deslocamento e condições específicas do evento.
      </p>

      <div className={cn("flex flex-col sm:flex-row gap-3", isPersonalizado && "flex-col-reverse")}>
        <Link
          to={contactUrl}
          className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition bg-accent-600 text-white hover:bg-accent-500 shadow-glow focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          Solicitar este orçamento
        </Link>
        <Link
          to="/contato?assunto=show&pacote=personalizado"
          className="inline-flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-semibold transition bg-white/10 text-white/90 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-accent-500"
        >
          Pedir orçamento personalizado
        </Link>
      </div>
    </div>
  );
}
