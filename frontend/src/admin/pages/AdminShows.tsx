import { useEffect, useState } from "react";
import { api, type Show, type ShowForm } from "../lib/api";
import DateInput from "../components/DateInput";

const STATUS_LABEL: Record<string, string> = { tickets: "Ingressos", soldout: "Esgotado", soon: "Em breve" };
const STATUS_COLOR: Record<string, string> = {
  tickets: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  soldout: "text-zinc-400 bg-zinc-500/10 border-zinc-700",
  soon:    "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const EMPTY: ShowForm = { date: "", city: "", venue: "", status: "", link: "" };

export default function AdminShows() {
  const [shows, setShows]     = useState<Show[]>([]);
  const [modal, setModal]     = useState<"new" | Show | null>(null);
  const [form, setForm]       = useState<ShowForm>(EMPTY);
  const [saving, setSaving]   = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() { setShows(await api.getShows(true)); }
  useEffect(() => { load(); }, []);

  function openNew()          { setForm(EMPTY); setModal("new"); }
  function openEdit(s: Show)  { setForm({ date: s.date, city: s.city, venue: s.venue, status: s.status ?? "", link: s.link ?? "" }); setModal(s); }

  async function save() {
    setSaving(true);
    try {
      if (modal === "new") await api.createShow(form);
      else await api.updateShow((modal as Show).id, form);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function remove(id: string) {
    await api.deleteShow(id);
    setDeleteId(null);
    load();
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Shows</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie a agenda de shows</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Novo Show
        </button>
      </div>

      <div className="bg-[#111] border border-[#2a2a2a] rounded-xl overflow-hidden">
        {shows.length === 0
          ? <p className="text-center py-16 text-zinc-600 text-sm">Nenhum show cadastrado.</p>
          : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2a2a2a] text-left">
                  {["Data", "Cidade", "Local", "Status", ""].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {shows.map((s) => (
                  <tr key={s.id} className={`transition-colors ${s.active ? "hover:bg-white/[0.02]" : "opacity-50 hover:opacity-70"}`}>
                    <td className="px-6 py-4 font-mono text-white">{s.date}</td>
                    <td className="px-6 py-4 text-zinc-300">{s.city}</td>
                    <td className="px-6 py-4 text-zinc-300">{s.venue}</td>
                    <td className="px-6 py-4">
                      {!s.active ? (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border text-zinc-500 bg-zinc-800/50 border-zinc-700">
                          Desativado
                        </span>
                      ) : s.status ? (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLOR[s.status] ?? "text-zinc-400"}`}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      ) : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteId(s.id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>

      {/* Form modal */}
      {modal !== null && (
        <Modal title={modal === "new" ? "Novo Show" : "Editar Show"} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <DateInput label="Data" value={form.date} onChange={(v) => setForm((f) => ({ ...f, date: v }))} withTime />
            {(["city", "venue", "link"] as const).map((field) => (
              <Field key={field} label={{ city: "Cidade", venue: "Local", link: "Link" }[field] ?? field}
                placeholder={{ city: "São Paulo", venue: "Arena XYZ", link: "https://..." }[field] ?? ""}
                value={form[field] ?? ""}
                onChange={(v) => setForm((f) => ({ ...f, [field]: v }))} />
            ))}
            <div>
              <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">Status</label>
              <select value={form.status ?? ""} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition">
                <option value="">— Sem status —</option>
                <option value="tickets">Ingressos</option>
                <option value="soldout">Esgotado</option>
                <option value="soon">Em breve</option>
              </select>
            </div>
          </div>
          <ModalActions onClose={() => setModal(null)} onSave={save} saving={saving} />
        </Modal>
      )}

      {deleteId && (
        <ConfirmDelete onCancel={() => setDeleteId(null)} onConfirm={() => remove(deleteId)}
          message="Excluir este show? A ação não pode ser desfeita." />
      )}
    </div>
  );
}

/* ─── Shared sub-components ──────────────────────────────────── */
function Field({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition" />
    </div>
  );
}

export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className={`bg-[#111] border border-[#2a2a2a] rounded-t-2xl sm:rounded-2xl w-full shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[85vh] ${wide ? "sm:max-w-3xl" : "sm:max-w-md"}`}>
        <div className="px-6 py-5 border-b border-[#2a2a2a] flex items-center justify-between flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-600 hover:text-zinc-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export function ModalActions({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#222]">
      <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-white bg-[#0d0d0d] hover:bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] transition-colors">
        Cancelar
      </button>
      <button onClick={onSave} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors">
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}

export function ConfirmDelete({ onCancel, onConfirm, message }: { onCancel: () => void; onConfirm: () => void; message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-zinc-300 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-zinc-400 bg-[#0d0d0d] hover:bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] transition-colors">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
