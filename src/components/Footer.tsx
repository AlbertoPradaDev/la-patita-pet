import Link from "next/link";
import { FacebookIcon, InstagramIcon, YouTubeIcon } from "@/icons";

const socials = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: YouTubeIcon, href: "#", label: "YouTube" },
];

const links = [
  { label: "Serviços", href: "#servicios" },
  { label: "Reservas", href: "#reservas" },
  { label: "Sobre Nós", href: "#nosotros" },
  { label: "Contactos", href: "#contacto" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#fff9f5" }} className="border-t border-[#f0e8ff]">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-2">
            <span className="text-3xl">🐾</span>
            <span className="text-xl font-black text-gray-800">
              La <span className="text-[#9b8acb]">Patita</span> Pet
            </span>
          </Link>

          {/* Links */}
          <ul className="flex flex-wrap justify-center gap-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-600 text-gray-500 hover:text-[#9b8acb] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Socials */}
          <div className="flex items-center gap-4">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200"
                style={{ background: "#f0e8ff" }}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#ede8f9] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-500">
          <p>© 2025 La Patita Pet. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Creado por: <a href="https://albertopradadev.com" className="text-[#9b8acb] font-600 hover:underline" target="_blank">Alberto Prada Dev</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
