import { useEffect, useRef, useState } from "react";
import { api, type NewsItem, type NewsDetail, type NewsForm } from "../lib/api";
import { Modal, ModalActions, ConfirmDelete } from "./AdminShows";

const EMPTY: NewsForm = { title: "", slug: "", content: "", excerpt: "", coverImage: "", published: false };
const BASE = import.meta.env.VITE_API_URL ?? "";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/* ── Field — module-level to prevent input remount on every render ── */
function Field({ label, value, onChange, placeholder, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
      />
    </div>
  );
}

/* ── ImageUpload ─────────────────────────────────────────────────── */
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch(`${BASE}/api/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) onChange(`${BASE}${data.url}`);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Imagem de capa</label>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="capa" className="h-16 w-24 object-cover rounded-lg border border-[#2a2a2a] flex-shrink-0" />
        )}
        <button type="button" disabled={uploading} onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-zinc-400 hover:text-white transition-colors disabled:opacity-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {uploading ? "Enviando…" : value ? "Trocar imagem" : "Escolher imagem"}
        </button>
        {value && (
          <button type="button" onClick={() => onChange("")} title="Remover imagem"
            className="text-zinc-600 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

/* ── RichTextArea ────────────────────────────────────────────────── */
function RichTextArea({ value, onChange, rows = 14, placeholder }: {
  value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pendingCursor = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (pendingCursor.current && ref.current) {
      ref.current.selectionStart = pendingCursor.current[0];
      ref.current.selectionEnd = pendingCursor.current[1];
      pendingCursor.current = null;
    }
  });

  function wrap(before: string, after = "") {
    const el = ref.current;
    if (!el) return;
    const [s, e] = [el.selectionStart, el.selectionEnd];
    const sel = value.slice(s, e);
    onChange(value.slice(0, s) + before + sel + after + value.slice(e));
    pendingCursor.current = [s + before.length, s + before.length + sel.length];
  }

  function linePrefix(prefix: string) {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", pos - 1) + 1;
    onChange(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    pendingCursor.current = [pos + prefix.length, pos + prefix.length];
  }

  function insertHR() {
    const el = ref.current;
    if (!el) return;
    const pos = el.selectionStart;
    const insert = "\n---\n";
    onChange(value.slice(0, pos) + insert + value.slice(pos));
    pendingCursor.current = [pos + insert.length, pos + insert.length];
  }

  const actions = [
    { label: "H2",       title: "Título (H2)",         action: () => linePrefix("## ")  },
    { label: "H3",       title: "Subtítulo (H3)",       action: () => linePrefix("### ") },
    { label: "B",        title: "Negrito",   bold: true, action: () => wrap("**", "**")  },
    { label: "I",        title: "Itálico", italic: true, action: () => wrap("_", "_")    },
    { label: "—",        title: "Separador horizontal", action: insertHR                 },
    { label: "• Lista",  title: "Item de lista",        action: () => linePrefix("- ")   },
    { label: "❝ Citação",title: "Bloco de citação",     action: () => linePrefix("> ")   },
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {actions.map(({ label, title, bold, italic, action }) => (
          <button key={label} type="button" title={title}
            onMouseDown={(e) => { e.preventDefault(); action(); }}
            className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white bg-[#0d0d0d] hover:bg-[#1a1a1a] border border-[#2a2a2a] rounded transition-colors"
            style={{ fontWeight: bold ? "bold" : undefined, fontStyle: italic ? "italic" : undefined }}>
            {label}
          </button>
        ))}
      </div>
      <textarea ref={ref} value={value} onChange={(e) => onChange(e.target.value)}
        rows={rows} placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-mono leading-relaxed resize-y"
      />
      <p className="text-xs text-zinc-700 mt-1">Markdown: **negrito**, _itálico_, ## título, - lista, --- separador</p>
    </div>
  );
}

export default function AdminNews() {
  const [items, setItems]       = useState<NewsItem[]>([]);
  const [detail, setDetail]     = useState<NewsDetail | null>(null);
  const [modal, setModal]       = useState<"new" | NewsItem | null>(null);
  const [form, setForm]         = useState<NewsForm>(EMPTY);
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() { setItems(await api.getNews(true)); }
  useEffect(() => { load(); }, []);

  async function openView(item: NewsItem) {
    const d = await api.getNewsItem(item.id);
    setDetail(d);
  }

  function openNew() { setForm(EMPTY); setDetail(null); setModal("new"); }

  function openEdit(item: NewsItem) {
    setDetail(null);
    api.getNewsItem(item.id).then((d) => {
      setForm({
        title: d.title, slug: d.slug, content: d.content,
        excerpt: d.excerpt ?? "", coverImage: d.coverImage ?? "",
        published: d.published,
      });
      setModal(item);
    });
  }

  function setField<K extends keyof NewsForm>(key: K, val: NewsForm[K]) {
    setForm((f) => {
      const next = { ...f, [key]: val };
      if (key === "title") next.slug = slugify(String(val));
      return next;
    });
  }

  async function save() {
    setSaving(true);
    try {
      if (modal === "new") await api.createNews(form);
      else await api.updateNews((modal as NewsItem).id, form);
      setModal(null); load();
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    await api.deleteNews(id);
    setDeleteId(null);
    if (detail?.id === id) setDetail(null);
    load();
  }

  const statusBadge = (published: boolean) =>
    published
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Notícias</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie posts e notícias do blog</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nova Notícia
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {items.length === 0
            ? <p className="text-center py-12 text-zinc-600 text-sm bg-[#111] border border-[#2a2a2a] rounded-xl">Nenhuma notícia ainda.</p>
            : items.map((item) => (
              <div key={item.id} onClick={() => openView(item)}
                className={`bg-[#111] border rounded-xl p-4 cursor-pointer transition-all ${
                  detail?.id === item.id ? "border-red-500/40" : "border-[#2a2a2a] hover:border-zinc-600"
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white text-sm truncate leading-snug">{item.title}</p>
                    <p className="text-zinc-700 text-xs font-mono mt-0.5">/{item.slug}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusBadge(item.published)}`}>
                        {item.published ? "Publicado" : "Rascunho"}
                      </span>
                      <span className="text-zinc-700 text-xs">
                        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                      className="p-1 text-zinc-600 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                      className="p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          {!detail
            ? <div className="bg-[#111] border border-[#2a2a2a] rounded-xl flex items-center justify-center h-64 text-zinc-700 text-sm">
                Selecione uma notícia para visualizar
              </div>
            : <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#2a2a2a] flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{detail.title}</p>
                    <p className="text-xs text-zinc-600 font-mono mt-0.5">/{detail.slug}</p>
                  </div>
                  <span className={`ml-3 flex-shrink-0 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusBadge(detail.published)}`}>
                    {detail.published ? "Publicado" : "Rascunho"}
                  </span>
                </div>
                {detail.coverImage && (
                  <img src={detail.coverImage} alt="" className="w-full h-40 object-cover" />
                )}
                <div className="p-5">
                  {detail.excerpt && (
                    <p className="text-zinc-400 text-sm italic mb-4 pb-4 border-b border-[#222]">{detail.excerpt}</p>
                  )}
                  <div className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {detail.content}
                  </div>
                </div>
              </div>}
        </div>
      </div>

      {modal !== null && (
        <Modal title={modal === "new" ? "Nova Notícia" : "Editar Notícia"} onClose={() => setModal(null)} wide>
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <Field label="Título" value={form.title}
              onChange={(v) => setField("title", v)} placeholder="AC/DC anuncia turnê no Brasil" />
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Slug (gerado automaticamente)</label>
              <div className="w-full bg-[#080808] border border-[#1e1e1e] rounded-lg px-4 py-2.5 text-sm text-zinc-500 font-mono truncate">
                /{form.slug || <span className="text-zinc-700">será-gerado-do-titulo</span>}
              </div>
            </div>
            <ImageUpload value={form.coverImage ?? ""} onChange={(v) => setField("coverImage", v)} />
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Resumo</label>
              <textarea value={String(form.excerpt ?? "")} onChange={(e) => setField("excerpt", e.target.value)}
                rows={2} placeholder="Breve descrição para listagem..."
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Conteúdo</label>
              <RichTextArea value={form.content} onChange={(v) => setField("content", v)}
                placeholder="Escreva o conteúdo aqui..." />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setField("published", !form.published)}
                className={`relative inline-flex w-10 h-5 rounded-full transition-colors ${form.published ? "bg-red-600" : "bg-zinc-700"}`}>
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.published ? "translate-x-5" : ""}`} />
              </button>
              <span className="text-sm text-zinc-400">{form.published ? "Publicado" : "Rascunho"}</span>
            </div>
          </div>
          <ModalActions onClose={() => setModal(null)} onSave={save} saving={saving} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)}
          message="Excluir esta notícia? A ação não pode ser desfeita." />
      )}
    </div>
  );
}
