import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Início" },
  { to: "/shows", label: "Agenda" },
  { to: "/media", label: "Mídia" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b border-white/10 bg-black/50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-6">
        <Link to="/" className="inline-flex items-center gap-3">
          <img
            src="/acidc-logo.png"
            alt="ACID/C"
            className="h-8 w-auto drop-shadow"
          />
          <span className="sr-only">ACID/C</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-accent-600 text-white shadow-glow"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
