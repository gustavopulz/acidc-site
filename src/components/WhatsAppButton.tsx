export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/19997404451"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 transition-colors"
      aria-label="Fale conosco no WhatsApp"
    >
      <img
        src="/whatsapp.png"
        alt="WhatsApp"
        width={28}
        height={28}
        style={{ display: "block" }}
      />
    </a>
  );
}
