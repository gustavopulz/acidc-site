import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Section from "../components/Section";

export default function Contact() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    evento: "",
    mensagem: "",
  });
  const [sent, setSent] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { nome, email, evento, mensagem } = form;

    const texto = `🎸 *Novo contato ACID/C!*\n\n👤 *Nome:* ${nome}\n📧 *E-mail:* ${email}\n📍 *Local/Evento:* ${evento}\n📝 *Mensagem:*\n${mensagem}`;
    const encoded = encodeURIComponent(texto);
    const url = `https://wa.me/5519997404451?text=${encoded}`;
    setWaUrl(url);
    window.open(url, "_blank");
    setSent(true);
  };

  // Oculta a mensagem de sucesso após alguns segundos
  useEffect(() => {
    if (!sent) return;
    const t = setTimeout(() => setSent(false), 8000);
    return () => clearTimeout(t);
  }, [sent]);

  return (
    <Section
      title="Contato para shows"
      subtitle="Envie os detalhes do seu evento que retornamos em breve."
    >
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-xl">
        <div>
          <label className="block text-sm mb-1">Nome</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Seu nome"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2"
            placeholder="voce@exemplo.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Local/Evento</label>
          <input
            name="evento"
            value={form.evento}
            onChange={handleChange}
            className="w-full rounded-md bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Cidade, casa, data estimada"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mensagem</label>
          <textarea
            name="mensagem"
            value={form.mensagem}
            onChange={handleChange}
            className="w-full min-h-[120px] rounded-md bg-white/10 border border-white/10 px-3 py-2"
            placeholder="Conte-nos mais..."
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold bg-accent-600 hover:bg-accent-500 shadow-glow"
          >
            Enviar via WhatsApp
          </button>
          {sent && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-start justify-between gap-3 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-emerald-200"
            >
              <div className="flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <p className="text-sm">
                  Pronto! Abrimos o WhatsApp com sua mensagem.{" "}
                  {waUrl && (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-emerald-400/60 underline-offset-4 hover:no-underline"
                    >
                      Abrir novamente
                    </a>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSent(false)}
                aria-label="Fechar aviso"
                className="text-emerald-200/80 transition-colors hover:text-emerald-100"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </form>
    </Section>
  );
}
