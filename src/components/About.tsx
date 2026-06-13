"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "+500", label: "Animais atendidos", emoji: "🐾" },
  { value: "5 ★", label: "Avaliação média", emoji: "⭐" },
  { value: "5 anos", label: "De experiência", emoji: "🏆" },
  { value: "100%", label: "Amor e dedicação", emoji: "❤️" },
];

const values = [
  {
    emoji: "💚",
    title: "Amor pelos animais",
    desc: "Cada animal é tratado com a mesma ternura que lhe daria em casa.",
    bg: "#e6f7f1",
    accent: "#5aad8a",
  },
  {
    emoji: "🧴",
    title: "Produtos premium",
    desc: "Utilizamos apenas produtos hipoalergénicos e seguros para o seu peludo.",
    bg: "#f9f0ff",
    accent: "#9b8acb",
  },
  {
    emoji: "🕐",
    title: "Pontualidade garantida",
    desc: "Respeitamos o seu tempo. A sua consulta começa à hora marcada.",
    bg: "#fff4e8",
    accent: "#e09050",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.55, ease: "easeOut" as const },
  }),
};

export default function About() {
  return (
    <section
      id="nosotros"
      className="py-24 px-6 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #fff9f5 0%, #f3eeff 50%, #e8f8f2 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #c7b8ea, transparent)" }}
      />
      <div
        className="absolute bottom-[-60px] left-[-60px] w-60 h-60 rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #b5ead7, transparent)" }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4"
            style={{ background: "#e8f8f2", color: "#5aad8a" }}
          >
            🐶 Quem somos
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            Uma família que{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #9b8acb, #5aad8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ama
            </span>{" "}
            os seus animais
          </h2>
          <p className="text-lg text-gray-500 font-500 max-w-2xl mx-auto leading-relaxed">
            Somos uma equipa de estilistas apaixonados pelo bem-estar animal. Cada visita
            é uma experiência de cuidado, carinho e profissionalismo para o seu companheiro peludo.
          </p>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left — illustration / photo placeholder */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Big soft card */}
            <div
              className="w-full max-w-md aspect-square rounded-[40px] flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #ede8f9 0%, #d4f0e5 100%)",
                boxShadow: "0 20px 60px rgba(199,184,234,0.35)",
              }}
            >
              <Image
                src="/gallery.png"
                alt="Gallery"
                fill
                className="object-cover object-center"
              />

              {/* Floating badge */}
              <motion.div
                className="absolute top-6 right-6 bg-white rounded-2xl px-4 py-2 shadow-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-xs text-gray-400 font-600">Estilistas</p>
                <p className="text-sm font-800 text-gray-800">Com ❤️ para eles</p>
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-2 shadow-lg"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <p className="text-xs text-gray-400 font-600">Desde</p>
                <p className="text-sm font-800 text-gray-800">2020 🏡</p>
                {/* pt-PT keeps "Desde" — works in both languages */}
              </motion.div>
            </div>

            {/* Decorative paw prints */}
            {["top-2 left-4", "bottom-12 right-2", "top-1/2 left-[-16px]"].map((pos, i) => (
              <motion.span
                key={i}
                className={`absolute ${pos} text-2xl opacity-30 select-none`}
                animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
              >
                🐾
              </motion.span>
            ))}
          </motion.div>

          {/* Right — text + values */}
          <div className="space-y-8">
            <motion.p
              className="text-gray-600 font-500 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ duration: 0.6 }}
            >
              Nascemos em 2020 com uma missão simples:{" "}
              <strong className="text-gray-800">
                que cada animal saia mais feliz do que entrou.
              </strong>{" "}
              As nossas instalações são seguras, higiénicas e pensadas para que o seu peludo
              se sinta confortável desde o primeiro momento.
            </motion.p>

            {/* Values cards */}
            <div className="space-y-4">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0 }}
                  className="flex items-start gap-4 p-4 rounded-2xl transition-all hover:shadow-md"
                  style={{ background: v.bg }}
                >
                  <span className="text-3xl flex-shrink-0">{v.emoji}</span>
                  <div>
                    <h4 className="font-800 text-gray-800 mb-0.5" style={{ color: v.accent }}>
                      {v.title}
                    </h4>
                    <p className="text-sm text-gray-500 font-500">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.7 }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow"
              style={{ boxShadow: "0 4px 20px rgba(199,184,234,0.15)" }}
            >
              <span className="text-4xl mb-2">{s.emoji}</span>
              <span className="text-3xl font-black text-gray-800 mb-1">{s.value}</span>
              <span className="text-sm text-gray-400 font-600">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
