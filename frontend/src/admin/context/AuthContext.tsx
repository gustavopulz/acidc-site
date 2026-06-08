import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

interface AdminUser { id: string; name: string; email: string }

interface AuthCtx {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null, loading: true,
  login: async () => {}, logout: () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (!t) { setLoading(false); return; }
    api.me()
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem("adminToken"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, ...u } = await api.login(email, password);
    localStorage.setItem("adminToken", token);
    setUser({ ...u, id: "" });
    const me = await api.me();
    setUser(me);
  }

  function logout() {
    localStorage.removeItem("adminToken");
    setUser(null);
  }

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export const useAdminAuth = () => useContext(Ctx);
