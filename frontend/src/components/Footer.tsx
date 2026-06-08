export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-white/70 gap-4">
        <p>
          © {new Date().getFullYear()} ACID/C — Banda cover de AC/DC. Todos os
          direitos reservados.
        </p>

        {/* Redes sociais */}
        <div className="flex items-center gap-4">
          {/* Instagram */}
          <a
            href="https://www.instagram.com/acidcband"
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
          {/* YouTube */}
          <a
            href="https://www.youtube.com/@acid_c"
            target="_blank"
            rel="noreferrer"
            className="text-white/70 hover:text-white transition"
            aria-label="YouTube da banda ACID/C"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="currentColor"
              aria-hidden
            >
              <path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.3.5A3.1 3.1 0 0 0 .5 6.2 32.4 32.4 0 0 0 0 12a32.4 32.4 0 0 0 .5 5.8 3.1 3.1 0 0 0 2.2 2.2c1.8.5 9.3.5 9.3.5s7.5 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2A32.4 32.4 0 0 0 24 12a32.4 32.4 0 0 0-.5-5.8ZM9.8 15.5v-7l6.3 3.5-6.3 3.5Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
