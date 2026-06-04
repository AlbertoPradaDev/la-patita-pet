"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicios" },
  { label: "Sobre Nós", href: "#nosotros" },
  { label: "Contactos", href: "#contacto" },
];

const NAVBAR_HEIGHT = 72; // px — offset para o navbar fixo

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      // Atualiza o link ativo com base na secção visível
      const sectionIds = ["inicio", "servicios", "nosotros", "contacto"];
      for (const id of [...sectionIds].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= NAVBAR_HEIGHT + 40) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      setMenuOpen(false);
      if (href.startsWith("/")) {
        router.push(href);
      } else {
        const id = href.replace("#", "");
        smoothScrollTo(id);
      }
    },
    [router]
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(199,184,234,0.25)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#inicio"
          onClick={(e) => handleNav(e, "#inicio")}
          className="flex items-center gap-2 group"
        >
          <span className="text-3xl group-hover:animate-bounce transition-all">🐾</span>
          <span className="text-xl font-black text-gray-800 tracking-tight">
            La <span className="text-[#9b8acb]">Patita</span> Pet
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => {
            const id = l.href.replace("#", "");
            const isActive = active === id;
            return (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleNav(e, l.href)}
                  className={`text-sm font-700 transition-colors duration-200 relative
                    after:absolute after:bottom-[-3px] after:left-0 after:h-[2px] after:bg-[#b5ead7] after:transition-all after:duration-300
                    ${isActive
                      ? "text-[#9b8acb] after:w-full"
                      : "text-gray-600 hover:text-[#9b8acb] after:w-0 hover:after:w-full"
                    }`}
                >
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <a
          href="/reservas"
          onClick={(e) => handleNav(e, "/reservas")}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-800 text-white
            shadow-[0_4px_15px_rgba(181,234,215,0.5)] hover:shadow-[0_6px_20px_rgba(199,184,234,0.6)]
            hover:scale-105 transition-all duration-300"
          style={{ background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)" }}
        >
          🐶 Reservar agora
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : "mb-1.5"}`} />
          <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "opacity-0" : "mb-1.5"}`} />
          <div className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } bg-white/95 backdrop-blur-md border-t border-[#e8e0f5]`}
      >
        <div className="px-6 py-5 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => handleNav(e, l.href)}
              className="block text-base font-700 text-gray-700 hover:text-[#9b8acb] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/reservas"
            onClick={(e) => handleNav(e, "#reservas")}
            className="block text-center px-5 py-3 rounded-full text-white font-800 text-sm shadow-lg hover:scale-105 transition-transform duration-200"
            style={{ background: "linear-gradient(135deg, #b5ead7, #c7b8ea)" }}
          >
            🐶 Reservar agora
          </a>
        </div>
      </div>
    </header>
  );
}
