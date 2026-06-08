import { useEffect, useState } from "react";
import Section from "../components/Section";

function mdInline(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>");
}

function mdToHtml(md: string): string {
  return md.split(/\n{2,}/).map((block) => {
    const lines = block.split("\n");
    if (lines.length === 1) {
      if (lines[0].startsWith("### ")) return `<h3>${mdInline(lines[0].slice(4))}</h3>`;
      if (lines[0].startsWith("## "))  return `<h2>${mdInline(lines[0].slice(3))}</h2>`;
      if (lines[0].startsWith("# "))   return `<h1>${mdInline(lines[0].slice(2))}</h1>`;
      if (lines[0].trim() === "---")    return `<hr/>`;
    }
    if (lines.every((l) => /^[-*]\s/.test(l))) {
      return `<ul>${lines.map((l) => `<li>${mdInline(l.replace(/^[-*]\s/, ""))}</li>`).join("")}</ul>`;
    }
    if (lines.every((l) => l.startsWith("> "))) {
      return `<blockquote>${mdInline(lines.map((l) => l.slice(2)).join(" "))}</blockquote>`;
    }
    return `<p>${lines.map(mdInline).join("<br/>")}</p>`;
  }).join("");
}

interface NewsItem {
  id: string; title: string; slug: string; excerpt?: string;
  coverImage?: string; published: boolean; createdAt: string; content?: string;
}

const BASE = import.meta.env.VITE_API_URL ?? "";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function News() {
  const [items, setItems]       = useState<NewsItem[]>([]);
  const [loading, setLoading]   = useState(!!BASE);
  const [selected, setSelected] = useState<NewsItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    if (!BASE) { setLoading(false); return; }
    fetch(`${BASE}/api/news`)
      .then((r) => r.json())
      .then((data: NewsItem[]) => { if (Array.isArray(data)) setItems(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function openArticle(item: NewsItem) {
    if (!BASE) return;
    setDetailLoading(true);
    try {
      const data = await fetch(`${BASE}/api/news/${item.id}`).then((r) => r.json());
      setSelected(data);
    } finally { setDetailLoading(false); }
  }

  return (
    <>
      <Section title="Notícias" subtitle="Fique por dentro das novidades da banda.">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-white/40 text-sm">Carregando…</div>
        ) : items.length === 0 ? (
          <p className="text-white/50 text-sm">Nenhuma notícia publicada ainda.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => openArticle(item)}
                className="text-left group rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] overflow-hidden transition-colors">
                {item.coverImage && (
                  <div className="aspect-[16/7] overflow-hidden">
                    <img src={item.coverImage} alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition" loading="lazy" />
                  </div>
                )}
                <div className="p-5">
                  <p className="text-xs text-white/40 mb-2">{formatDate(item.createdAt)}</p>
                  <h3 className="text-white font-bold text-lg leading-snug mb-2 group-hover:text-accent-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-white/60 text-sm line-clamp-3">{item.excerpt}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent-400 font-medium">
                    Ler mais
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>

      {/* Article modal */}
      {(selected || detailLoading) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="w-full sm:max-w-2xl bg-[#111] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0">
              <p className="text-xs text-white/40">{selected ? formatDate(selected.createdAt) : ""}</p>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white transition-colors">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {detailLoading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : selected && (
              <div className="overflow-y-auto flex-1">
                {selected.coverImage && (
                  <img src={selected.coverImage} alt={selected.title} className="w-full aspect-[16/7] object-cover" />
                )}
                <div className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-white mb-4 leading-tight">{selected.title}</h2>
                  {selected.excerpt && (
                    <p className="text-white/60 italic text-base mb-6 pb-6 border-b border-[#222]">{selected.excerpt}</p>
                  )}
                  <div className="text-white/80 text-base leading-relaxed news-content"
                    dangerouslySetInnerHTML={{ __html: mdToHtml(selected.content ?? "") }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
