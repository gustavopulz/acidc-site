import { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

const MONTHS = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
];
const DAY_LABELS = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = ["00","05","10","15","20","25","30","35","40","45","50","55"];

interface Props {
  id?: string;
  dateValue: string; // "2026-08-10" or ""
  timeValue: string; // "19:00" or ""
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}

function parseDateStr(s: string): { year: number; month: number; day: number } | null {
  if (!s) return null;
  const parts = s.split("-").map(Number);
  if (parts.length < 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1] - 1, day: parts[2] };
}

function toISODate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDisplay(dateStr: string, timeStr: string): string {
  const p = parseDateStr(dateStr);
  if (!p) return "";
  const d = String(p.day).padStart(2, "0");
  const m = String(p.month + 1).padStart(2, "0");
  const timePart = timeStr ? ` às ${timeStr.replace(":", "h")}` : "";
  return `${d}/${m}/${p.year}${timePart}`;
}

export default function DateTimePicker({
  id,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
}: Props) {
  const today = new Date();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(
    () => parseDateStr(dateValue)?.year ?? today.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState(
    () => parseDateStr(dateValue)?.month ?? today.getMonth()
  );

  // Sync view when value is set externally
  useEffect(() => {
    const p = parseDateStr(dateValue);
    if (p) {
      setViewYear(p.year);
      setViewMonth(p.month);
    }
  }, [dateValue]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  function selectDay(day: number) {
    onDateChange(toISODate(viewYear, viewMonth, day));
  }

  const selected = parseDateStr(dateValue);
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const adjustedFirst = (firstDayOfMonth + 6) % 7; // Monday = 0
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const cells: (number | null)[] = [
    ...Array<null>(adjustedFirst).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const [displayH, displayMin] = (timeValue || "19:00").split(":");

  const INPUT_CLS =
    "w-full rounded-md bg-white/10 border border-white/10 px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition flex items-center justify-between";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={cn(INPUT_CLS, isOpen && "ring-2 ring-accent-500 border-transparent")}
      >
        <span className={dateValue ? "text-white" : "text-white/30"}>
          {dateValue ? formatDisplay(dateValue, timeValue) : "Selecione data e horário"}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/40 shrink-0 ml-2"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {/* Popup */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Selecionar data e horário"
          className="absolute left-0 top-[calc(100%+6px)] z-50 w-[min(320px,90vw)] rounded-lg border border-white/10 bg-[#0f0f0f] shadow-2xl p-4 flex flex-col gap-4"
        >
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Mês anterior"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-white/60 hover:text-white transition text-lg"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Próximo mês"
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-white/10 text-white/60 hover:text-white transition text-lg"
            >
              ›
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-0.5">
            {DAY_LABELS.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-white/40 pb-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-0.5 -mt-3">
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const isToday =
                day === today.getDate() &&
                viewMonth === today.getMonth() &&
                viewYear === today.getFullYear();
              const isSelected =
                selected &&
                day === selected.day &&
                viewMonth === selected.month &&
                viewYear === selected.year;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    "w-full aspect-square text-sm rounded transition flex items-center justify-center",
                    isSelected
                      ? "bg-accent-600 text-white font-bold shadow-glow"
                      : isToday
                      ? "border border-accent-500/60 text-accent-400 font-medium"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time picker */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-white/50 mb-2.5">Horário do evento</p>
            <div className="flex items-center gap-2">
              <select
                value={displayH}
                onChange={(e) => onTimeChange(`${e.target.value}:${displayMin}`)}
                aria-label="Hora"
                className="flex-1 rounded bg-white/10 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 text-center"
              >
                {HOURS.map((hh) => (
                  <option key={hh} value={hh}>{hh}</option>
                ))}
              </select>
              <span className="text-white/50 font-bold text-sm">h</span>
              <select
                value={displayMin}
                onChange={(e) => onTimeChange(`${displayH}:${e.target.value}`)}
                aria-label="Minutos"
                className="flex-1 rounded bg-white/10 border border-white/10 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-accent-500 text-center"
              >
                {MINUTES.map((mm) => (
                  <option key={mm} value={mm}>{mm}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Confirm */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full rounded-md py-2 text-sm font-semibold bg-accent-600 text-white hover:bg-accent-500 transition focus:outline-none focus:ring-2 focus:ring-accent-500"
          >
            {dateValue ? "Confirmar" : "Fechar"}
          </button>
        </div>
      )}
    </div>
  );
}
