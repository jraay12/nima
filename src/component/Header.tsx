import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Members", href: "#members" },
  { label: "Events", href: "#events" },
  { label: "Community", href: "#community" },
  { label: "Contact Us", href: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ── Logo + Brand ── */}
            <a
              href="/"
              className="flex items-center gap-2.5 group shrink-0"
              aria-label="NIMA Home"
            >
              <div className="relative w-9 h-9 overflow-hidden rounded-lg">
                <img
                  src="https://nimanv.com/wp-content/uploads/2024/12/nima-logo.png"
                  alt="NIMA logo"
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#2d8a4e] transition-opacity duration-200 group-hover:opacity-80">
                NIMA
              </span>
            </a>

            {/* ── Desktop Nav ── */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main navigation"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative px-4 py-2 text-[14px] font-medium text-zinc-500 rounded-lg
                             hover:text-zinc-900 hover:bg-zinc-50
                             transition-all duration-200
                             after:content-[''] after:absolute after:bottom-0 after:left-4 after:right-4
                             after:h-[2px] after:bg-[#2d8a4e] after:scale-x-0 after:origin-left
                             after:transition-transform after:duration-200
                             hover:after:scale-x-100"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* ── Desktop CTA ── */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#join"
                className="relative inline-flex items-center gap-1.5 px-5 py-2 rounded-full
                           bg-[#2d8a4e] text-white text-[13px] font-semibold
                           shadow-[0_2px_8px_rgba(45,138,78,0.30)]
                           hover:bg-[#248542] hover:shadow-[0_4px_16px_rgba(45,138,78,0.40)]
                           active:scale-[0.97]
                           transition-all duration-200 overflow-hidden
                           before:content-[''] before:absolute before:inset-0
                           before:bg-white/10 before:opacity-0 before:transition-opacity
                           hover:before:opacity-100"
              >
                Join NIMA
              </a>
            </div>

            {/* ── Hamburger (mobile) ── */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg
                         text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100
                         transition-all duration-200 active:scale-95"
            >
              <span
                className={`transition-all duration-300 ${
                  menuOpen
                    ? "opacity-0 rotate-90 scale-50 absolute"
                    : "opacity-100 rotate-0 scale-100"
                }`}
              >
                <Menu size={20} strokeWidth={2} />
              </span>
              <span
                className={`transition-all duration-300 ${
                  menuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-50 absolute"
                }`}
              >
                <X size={20} strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] md:hidden
                    transition-opacity duration-300
                    ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* ── Mobile Drawer ── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[280px] bg-white shadow-2xl
                    flex flex-col md:hidden
                    transform transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <img
              src="https://nimanv.com/wp-content/uploads/2024/12/nima-logo.png"
              alt="NIMA"
              className="w-7 h-7 object-contain"
            />
            <span className="text-lg font-bold text-[#2d8a4e]">NIMA</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100
                       transition-all duration-200"
            aria-label="Close menu"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col px-3 py-4 gap-1 flex-1">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-xl
                         text-[14px] font-medium text-zinc-600
                         hover:text-zinc-900 hover:bg-zinc-50
                         transition-all duration-150 active:scale-[0.98]"
              style={{
                transitionDelay: menuOpen ? `${i * 40}ms` : "0ms",
                transform: menuOpen ? "translateX(0)" : "translateX(12px)",
                opacity: menuOpen ? 1 : 0,
                transition: `transform 300ms ease ${i * 40}ms, opacity 300ms ease ${i * 40}ms, background 150ms`,
              }}
            >
              {link.label}
              <ChevronDown
                size={14}
                strokeWidth={2}
                className="-rotate-90 text-zinc-300"
              />
            </a>
          ))}
        </nav>

        {/* Drawer footer CTA */}
        <div className="px-5 py-5 border-t border-zinc-100">
          <a
            href="#join"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center w-full py-3 rounded-full
                       bg-[#2d8a4e] text-white text-[14px] font-semibold
                       shadow-[0_2px_10px_rgba(45,138,78,0.28)]
                       hover:bg-[#248542] active:scale-[0.97]
                       transition-all duration-200"
          >
            Join NIMA
          </a>
          <p className="text-center text-[11px] text-zinc-400 mt-2.5">
            Join thousands of members nationwide
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;
