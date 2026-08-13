import { useLocation } from 'react-router-dom';

const FloatingWhatsApp = () => {
  const { pathname } = useLocation();

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  const msg = "Hello LittleForest! I'd like to know more about your plants and seedlings.";
  const url = `https://wa.me/2540143538080?text=${encodeURIComponent(msg)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-200 group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />

      {/* WhatsApp logo SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 relative z-10"
        fill="white"
      >
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.83 1.78 6.865L2 30l7.34-1.74A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.5a11.44 11.44 0 01-5.85-1.607l-.42-.25-4.355 1.032 1.062-4.24-.274-.435A11.5 11.5 0 1116 27.5zm6.29-8.61c-.344-.172-2.04-1.006-2.355-1.12-.316-.115-.546-.172-.776.172-.23.344-.89 1.12-1.09 1.35-.2.23-.4.258-.745.086-.344-.172-1.452-.535-2.766-1.707-1.022-.912-1.712-2.037-1.912-2.38-.2-.345-.021-.531.15-.703.154-.154.344-.4.516-.6.172-.2.23-.344.344-.574.115-.23.057-.43-.029-.602-.086-.172-.776-1.87-1.063-2.56-.28-.672-.564-.58-.776-.591l-.66-.012c-.23 0-.602.086-.917.43s-1.205 1.177-1.205 2.87 1.234 3.33 1.406 3.56c.172.23 2.43 3.71 5.886 5.203.823.355 1.465.567 1.965.726.826.263 1.578.226 2.173.137.663-.1 2.04-.833 2.327-1.638.287-.804.287-1.493.2-1.637-.086-.144-.315-.23-.66-.4z" />
      </svg>
    </a>
  );
};

export default FloatingWhatsApp;
