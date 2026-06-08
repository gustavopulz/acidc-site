function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function maskDateTime(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 12);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
  if (d.length <= 10) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)} ${d.slice(8)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4, 8)} ${d.slice(8, 10)}:${d.slice(10)}`;
}

interface DateInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  withTime?: boolean;
}

export default function DateInput({ label, value, onChange, withTime = false }: DateInputProps) {
  const mask = withTime ? maskDateTime : maskDate;
  const placeholder = withTime ? "dd/mm/aaaa hh:mm" : "dd/mm/aaaa";
  const maxLength = withTime ? 16 : 10;

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(mask(e.target.value))}
        maxLength={maxLength}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
      />
    </div>
  );
}
