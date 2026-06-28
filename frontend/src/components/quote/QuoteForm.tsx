import { cn } from "../../lib/cn";
import type { QuoteFormData, QuoteFormErrors } from "../../types/quote";
import { ALL_PACKAGES, brlCompact, ESTADOS_BR } from "../../config/quoteConfig";
import { useCidades } from "../../hooks/useCidades";
import DateTimePicker from "./DateTimePicker";
import SearchableSelect, { type SelectOption } from "./SearchableSelect";

const INPUT = "w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition";
const LABEL = "block text-sm text-white/80 mb-1";
const ERR = "mt-1 text-xs text-red-400";

const ESTADO_OPTIONS: SelectOption[] = ESTADOS_BR.map((e) => ({
  value: e.uf,
  label: e.nome,
}));

interface Props {
  form: QuoteFormData;
  errors: QuoteFormErrors;
  onChange: (field: keyof QuoteFormData, value: string) => void;
}

export default function QuoteForm({ form, errors, onChange }: Props) {
  const { cidades, loading: cidadesLoading, error: cidadesError } = useCidades(form.estado);

  const cidadeOptions: SelectOption[] = cidades.map((c) => ({ value: c, label: c }));

  function handleEstadoChange(val: string) {
    onChange("estado", val);
    onChange("cidade", ""); // reset city on state change
  }

  return (
    <div className="grid gap-5">
      {/* Pacote */}
      <div>
        <label htmlFor="q-pacote" className={LABEL}>Pacote de show</label>
        <select
          id="q-pacote"
          value={form.pacote}
          onChange={(e) => onChange("pacote", e.target.value)}
          className={cn(INPUT, errors.pacote && "border-red-500/60")}
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
        {errors.pacote && <p className={ERR}>{errors.pacote}</p>}
      </div>

      {/* Data e hora */}
      <div>
        <label htmlFor="q-data" className={LABEL}>Data e horário do evento</label>
        <DateTimePicker
          id="q-data"
          dateValue={form.data}
          timeValue={form.hora}
          onDateChange={(v) => onChange("data", v)}
          onTimeChange={(v) => onChange("hora", v)}
        />
        {errors.data && <p className={ERR}>{errors.data}</p>}
      </div>

      {/* Estado */}
      <div>
        <label htmlFor="q-estado" className={LABEL}>Estado</label>
        <SearchableSelect
          id="q-estado"
          value={form.estado}
          onChange={handleEstadoChange}
          options={ESTADO_OPTIONS}
          placeholder="Selecione o estado"
        />
        {errors.estado && <p className={ERR}>{errors.estado}</p>}
      </div>

      {/* Cidade */}
      <div>
        <label htmlFor="q-cidade" className={LABEL}>Cidade</label>
        <SearchableSelect
          id="q-cidade"
          value={form.cidade}
          onChange={(v) => onChange("cidade", v)}
          options={cidadeOptions}
          placeholder={
            !form.estado
              ? "Selecione o estado primeiro"
              : cidadesLoading
              ? "Carregando cidades…"
              : cidadesError
              ? "Erro ao carregar cidades"
              : "Selecione a cidade"
          }
          disabled={!form.estado || cidadesLoading}
        />
        {cidadesError && (
          <p className={ERR}>Não foi possível carregar as cidades.</p>
        )}
        {errors.cidade && <p className={ERR}>{errors.cidade}</p>}
      </div>

      {/* Rua */}
      <div>
        <label htmlFor="q-rua" className={LABEL}>
          Rua / Endereço do evento
          <span className="ml-2 text-white/40 text-xs font-normal">
            (usado para calcular o deslocamento)
          </span>
        </label>
        <input
          id="q-rua"
          type="text"
          value={form.rua}
          onChange={(e) => onChange("rua", e.target.value)}
          placeholder="Ex: Rua das Flores, 123"
          className={cn(INPUT, errors.rua && "border-red-500/60")}
        />
        {errors.rua && <p className={ERR}>{errors.rua}</p>}
      </div>

      {/* Público + Ambiente + Som */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label htmlFor="q-pessoas" className={LABEL}>Público estimado</label>
          <input
            id="q-pessoas"
            type="number"
            min={1}
            value={form.pessoas}
            onChange={(e) => onChange("pessoas", e.target.value)}
            placeholder="100"
            className={cn(INPUT, errors.pessoas && "border-red-500/60")}
          />
          {errors.pessoas && <p className={ERR}>{errors.pessoas}</p>}
        </div>

        <div>
          <label htmlFor="q-ambiente" className={LABEL}>Tipo de ambiente</label>
          <select
            id="q-ambiente"
            value={form.ambiente}
            onChange={(e) => onChange("ambiente", e.target.value)}
            className={cn(INPUT, errors.ambiente && "border-red-500/60")}
          >
            <option value="">Selecione</option>
            <option value="interno">Interno</option>
            <option value="externo">Externo</option>
          </select>
          {errors.ambiente && <p className={ERR}>{errors.ambiente}</p>}
        </div>

        <div>
          <label htmlFor="q-som" className={LABEL}>Precisa de som?</label>
          <select
            id="q-som"
            value={form.precisaSom}
            onChange={(e) => onChange("precisaSom", e.target.value)}
            className={cn(INPUT, errors.precisaSom && "border-red-500/60")}
          >
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
          {errors.precisaSom && <p className={ERR}>{errors.precisaSom}</p>}
        </div>
      </div>
    </div>
  );
}
