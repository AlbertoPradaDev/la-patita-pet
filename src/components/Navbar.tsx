"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Serviços", href: "#servicios" },
  { label: "Sobre Nós", href: "#nosotros" },
  { label: "Contactos", href: "#contacto" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-md shadow-[0_2px_20px_rgba(199,184,234,0.25)]"
          : "bg-transparent"
        }`}
    >
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="#inicio" className="flex items-center gap-2 group">
          <span className="text-3xl group-hover:animate-bounce transition-all">🐾</span>
          <span className="text-xl font-black text-gray-800 tracking-tight">
            La <span className="text-[#9b8acb]">Patita</span> Pet
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-sm font-700 text-gray-600 hover:text-[#9b8acb] transition-colors duration-200 relative after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-[2px] after:bg-[#b5ead7] after:transition-all hover:after:w-full"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="#reservas"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-800 text-white animate-pulse-ring
            bg-gradient-to-r from-[#b5ead7] via-[#c7b8ea] to-[#b5ead7] bg-size-200 bg-pos-0 hover:bg-pos-100
            shadow-[0_4px_15px_rgba(181,234,215,0.5)] hover:shadow-[0_6px_20px_rgba(199,184,234,0.6)]
            transition-all duration-500"
          style={{
            background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)",
          }}
        >
          🐶 Reservar agora
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5 transition-all" />
          <div className="w-6 h-0.5 bg-gray-700 mb-1.5 transition-all" />
          <div className="w-6 h-0.5 bg-gray-700 transition-all" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-[#e8e0f5] px-6 py-5 space-y-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block text-base font-700 text-gray-700 hover:text-[#9b8acb] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="#reservas"
            className="block text-center px-5 py-3 rounded-full text-white font-800 text-sm shadow-lg"
            style={{ background: "linear-gradient(135deg, #b5ead7, #c7b8ea)" }}
            onClick={() => setMenuOpen(false)}
          >
            🐶 Reservar agora
          </Link>
        </div>
      )}
    </header>
  );
}
