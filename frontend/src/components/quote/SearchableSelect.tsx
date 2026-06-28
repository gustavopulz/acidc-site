import { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

const BASE =
  "w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition";

export default function SearchableSelect({
  id,
  value,
  onChange,
  options,
  placeholder = "Selecione…",
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  const filtered = search.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const open = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setSearch("");
    setFocusedIdx(-1);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [disabled]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch("");
    setFocusedIdx(-1);
  }, []);

  // Fecha ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "Escape":
        close();
        break;
      case "ArrowDown":
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIdx >= 0 && filtered[focusedIdx]) {
          onChange(filtered[focusedIdx].value);
          close();
        }
        break;
    }
  }

  // Rola o item focado para dentro da viewport
  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIdx] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIdx]);

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger fechado */}
      {!isOpen && (
        <button
          id={id}
          type="button"
          onClick={open}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={false}
          className={cn(
            BASE,
            "text-left flex items-center justify-between gap-2",
            !value && "text-white/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="truncate min-w-0">{selectedLabel || placeholder}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-white/40 shrink-0"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      )}

      {/* Input de pesquisa (aberto) */}
      {isOpen && (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setFocusedIdx(-1); }}
            onKeyDown={handleKeyDown}
            placeholder="Pesquisar…"
            aria-expanded={true}
            aria-autocomplete="list"
            aria-haspopup="listbox"
            className={cn(BASE, "pr-8")}
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={placeholder}
          className="absolute left-0 top-[calc(100%+4px)] z-50 w-full max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#111111] shadow-2xl"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-3 text-sm text-white/40 text-center select-none">
              Nenhum resultado
            </li>
          ) : (
            filtered.map((opt, i) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onClick={() => { onChange(opt.value); close(); }}
                className={cn(
                  "px-3 py-2.5 text-sm cursor-pointer transition-colors select-none",
                  i === focusedIdx
                    ? "bg-accent-600/40 text-white"
                    : opt.value === value
                    ? "bg-white/10 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {opt.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
