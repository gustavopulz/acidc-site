import { cn } from "../../lib/cn";
import type { ShowPackage, PackageId } from "../../types/quote";
import { brlCompact } from "../../config/quoteConfig";

interface Props {
  pkg: ShowPackage;
  selected: boolean;
  onSelect: (id: PackageId) => void;
}

export default function ShowPackageCard({ pkg, selected, onSelect }: Props) {
  return (
    <div
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      onClick={() => onSelect(pkg.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(pkg.id);
        }
      }}
      className={cn(
        "relative rounded-lg border p-6 flex flex-col gap-4 transition-all cursor-pointer outline-none",
        pkg.highlighted ? "border-accent-500/50 bg-accent-900/20" : "border-white/10 bg-white/5",
        selected
          ? "ring-2 ring-accent-500 border-accent-500"
          : "hover:border-white/20 hover:bg-white/10",
        "focus-visible:ring-2 focus-visible:ring-accent-500"
      )}
    >
      {pkg.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center px-3 py-1 rounded-full bg-accent-600 text-white text-xs font-bold shadow-glow whitespace-nowrap">
          {pkg.badge}
        </span>
      )}

      <div>
        <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
        <p className="text-sm text-white/50 mt-0.5">{pkg.duration}</p>
      </div>

      <p className="text-white/70 text-sm flex-1">{pkg.description}</p>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="text-xs text-white/40 block">a partir de</span>
          <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-ember">
            {pkg.basePrice !== null ? brlCompact.format(pkg.basePrice) : "Sob consulta"}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pkg.id);
          }}
          className={cn(
            "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-500",
            selected
              ? "bg-accent-600 text-white shadow-glow"
              : "bg-white/10 text-white/90 hover:bg-white/15"
          )}
        >
          {selected ? "Selecionado" : "Selecionar pacote"}
        </button>
      </div>
    </div>
  );
}
