export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-white/70 gap-4">
        <p>
          © {new Date().getFullYear()} ACID/C — Banda cover de AC/DC. Todos os
          direitos reservados.
        </p>

        {/* Ícone do Instagram */}
        <a
          href="https://www.instagram.com/acidcband" // substitua pelo perfil real
          target="_blank"
          rel="noreferrer"
          className="text-white/70 hover:text-white transition"
          aria-label="Instagram da banda ACID/C"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 2.25h9A5.25 5.25 0 0 1 21.75 7.5v9a5.25 5.25 0 0 1-5.25 5.25h-9A5.25 5.25 0 0 1 2.25 16.5v-9A5.25 5.25 0 0 1 7.5 2.25z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 11.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM17.25 6.75h.008v.008h-.008V6.75z"
            />
          </svg>
        </a>
      </div>
    </footer>
  );
}
