"use client";

import { motion, type Variants } from "framer-motion";

const services = [
  {
    emoji: "🛁",
    name: "Banho & Brilho",
    description: "Banho com produtos premium, massagem relaxante e enxaguamento perfeito.",
    bg: "#FFD7E9",
    accent: "#e8a0c0",
    shadow: "rgba(255,215,233,0.6)",
  },
  {
    emoji: "💨",
    name: "Secagem Perfeita",
    description: "Secagem profissional com escovagem suave, deixando o pelo fofinho.",
    bg: "#AEC6CF",
    accent: "#7da8b5",
    shadow: "rgba(174,198,207,0.6)",
  },
  {
    emoji: "✂️",
    name: "Corte Estilizado",
    description: "Corte ao seu gosto com estilistas especializados em cada raça.",
    bg: "#C7B8EA",
    accent: "#9b8acb",
    shadow: "rgba(199,184,234,0.6)",
  },
  {
    emoji: "🐾",
    name: "Higiene Integral",
    description: "Limpeza de ouvidos, corte de unhas e cuidado bucal incluídos.",
    bg: "#B5EAD7",
    accent: "#5aad8a",
    shadow: "rgba(181,234,215,0.6)",
  },
];

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const card: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function Services() {
  return (
    <section id="servicios" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Subtle background dots */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #9b8acb 1.5px, transparent 1.5px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4"
            style={{ background: "#f9f0ff", color: "#9b8acb" }}
          >
            ✨ Os Nossos Serviços
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            Cuidado{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #9b8acb, #5aad8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              completo
            </span>{" "}
            para o seu animal
          </h2>
          <p className="text-lg text-gray-500 font-500 max-w-xl mx-auto">
            Cada serviço está pensado para que o seu peludo saia feliz, limpo e mais bonito do que nunca.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0 }}
        >
          {services.map((s) => (
            <motion.div
              key={s.name}
              variants={card}
              className="group flex flex-col items-center text-center cursor-pointer"
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Oval icon container */}
              <div
                className="w-52 h-64 rounded-[50%] flex flex-col items-center justify-center mb-6 transition-all duration-300 group-hover:scale-105"
                style={{
                  background: s.bg,
                  boxShadow: `0 12px 40px ${s.shadow}`,
                }}
              >
                <span className="text-7xl mb-3 group-hover:animate-bounce transition-all select-none">
                  {s.emoji}
                </span>
                <span
                  className="text-lg font-800 px-4"
                  style={{ color: s.accent }}
                >
                  {s.name}
                </span>
              </div>

              <p className="text-sm text-gray-500 font-500 leading-relaxed max-w-[180px]">
                {s.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#reservas"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-800 text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)",
              boxShadow: "0 8px 25px rgba(181,234,215,0.5)",
            }}
          >
            🐶 Reservar o serviço completo
          </a>
        </motion.div>
      </div>
    </section>
  );
}
