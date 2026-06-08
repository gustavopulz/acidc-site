import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { user, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  if (user) return <Navigate to="/admin/dashboard" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]"
      style={{ background: "radial-gradient(ellipse at center, #1a0a00 0%, #0d0d0d 70%)" }}>
      <div className="w-full max-w-sm px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600 mb-4"
            style={{ boxShadow: "0 0 30px rgba(220,38,38,0.5)" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9">
              <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="white" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-widest uppercase">ACID/C</h1>
          <p className="text-sm text-zinc-500 mt-1">Painel Administrativo</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl">
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="admin@acidc.com.br"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Senha</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-700 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-900 rounded-lg px-4 py-3">{error}</p>
            )}
            <button
              type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              style={{ boxShadow: loading ? "none" : "0 0 20px rgba(220,38,38,0.3)" }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <p className="text-center mt-6">
          <a href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">← Voltar ao site</a>
        </p>
      </div>
    </div>
  );
}
