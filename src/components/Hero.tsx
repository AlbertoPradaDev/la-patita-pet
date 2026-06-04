"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const floatingElements = [
  { emoji: "✨", top: "12%", left: "68%", delay: 0, size: "text-3xl", duration: 3.5 },
  { emoji: "⭐", top: "25%", left: "85%", delay: 0.8, size: "text-2xl", duration: 4.2 },
  { emoji: "✨", top: "55%", left: "78%", delay: 1.5, size: "text-xl", duration: 3.8 },
  { emoji: "🌸", top: "70%", left: "62%", delay: 0.4, size: "text-2xl", duration: 5 },
  { emoji: "💫", top: "18%", left: "55%", delay: 1.2, size: "text-lg", duration: 4.5 },
  { emoji: "🎀", top: "80%", left: "88%", delay: 2, size: "text-xl", duration: 3.2 },
  { emoji: "⭐", top: "40%", left: "92%", delay: 0.6, size: "text-3xl", duration: 4.8 },
];

const confettiPieces = [
  { color: "#ffdac1", top: "15%", left: "52%", rotate: 25, delay: 0 },
  { color: "#c7b8ea", top: "35%", left: "59%", rotate: -15, delay: 0.5 },
  { color: "#b5ead7", top: "60%", left: "56%", rotate: 40, delay: 1 },
  { color: "#ffd7e9", top: "22%", left: "75%", rotate: -30, delay: 0.3 },
  { color: "#aec6cf", top: "72%", left: "72%", rotate: 60, delay: 1.2 },
  { color: "#ffdac1", top: "48%", left: "87%", rotate: -45, delay: 0.7 },
];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background:
          "linear-gradient(135deg, #fff9f5 0%, #ffeee3 25%, #f9f0ff 60%, #e8f8f2 100%)",
      }}
    >
      {/* Background blobs */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #c7b8ea 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #b5ead7 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-[30%] left-[40%] w-[300px] h-[300px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #ffdac1 0%, transparent 70%)" }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-16">
        {/* Left — copy */}
        <div className="space-y-7 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4"
              style={{ background: "#e8f8f2", color: "#5aad8a" }}
            >
              🐾 Salão Canino & Felino
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl font-black text-gray-800 leading-[1.1]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            O seu animal{" "}
            <span
              className="relative inline-block"
              style={{
                background: "linear-gradient(135deg, #9b8acb, #5aad8a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              merece
            </span>{" "}
            o melhor
          </motion.h1>

          <motion.p
            className="text-lg text-gray-500 font-500 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Corte profissional, banho rejuvenescedor, secagem e cuidado completo de higiene.{" "}
            <strong className="text-gray-700">Porque eles dão-nos tudo.</strong>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/reservas"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)",
                boxShadow: "0 8px 25px rgba(181,234,215,0.5)",
              }}
            >
              📅 Marcar consulta
            </Link>
            <Link
              href="#servicios"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-700 text-gray-600 border-2 border-[#e8e0f5] hover:border-[#c7b8ea] hover:bg-[#f9f0ff] transition-all duration-300"
            >
              Ver serviços →
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="flex items-center gap-6 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {[
              { icon: "⭐", text: "5.0 avaliação" },
              { icon: "🐕", text: "+500 animais" },
              { icon: "🏆", text: "5 anos de exp." },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 text-sm text-gray-500 font-600">
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — dog illustration container */}
        <div className="relative flex items-center justify-center z-10">
          {/* Oval lavender backdrop */}
          <motion.div
            className="relative w-[340px] h-[400px] md:w-[400px] md:h-[470px] rounded-[50%] overflow-hidden flex items-end justify-center"
            style={{
              background: "linear-gradient(160deg, #e8e0f8 0%, #c7b8ea 60%, #a8c8e0 100%)",
              boxShadow: "0 20px 60px rgba(199,184,234,0.45)",
            }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            {/* Dog placeholder — swap with next/image when you add /public/hero-dog.jpg */}
            <div className="flex flex-col items-center justify-center h-full w-full">
              <span className="text-[180px] leading-none select-none" style={{ marginBottom: "-20px" }}>
                🐶
              </span>
            </div>
          </motion.div>

          {/* Floating decorative elements */}
          {floatingElements.map((el, i) => (
            <motion.div
              key={i}
              className={`absolute ${el.size} select-none pointer-events-none`}
              style={{ top: el.top, left: el.left }}
              animate={{
                y: [0, -14, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: el.duration,
                delay: el.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {el.emoji}
            </motion.div>
          ))}

          {/* Confetti strips */}
          {confettiPieces.map((c, i) => (
            <motion.div
              key={`conf-${i}`}
              className="absolute w-3 h-7 rounded-sm pointer-events-none"
              style={{
                background: c.color,
                top: c.top,
                left: c.left,
                rotate: `${c.rotate}deg`,
              }}
              animate={{ y: [0, 12, 0], rotate: [c.rotate, c.rotate + 30, c.rotate] }}
              transition={{ duration: 3 + i * 0.4, delay: c.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Floating service badge */}
          <motion.div
            className="absolute bottom-6 left-[-30px] bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{ boxShadow: "0 8px 30px rgba(199,184,234,0.3)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "#ffd7e9" }}
            >
              ✂️
            </div>
            <div>
              <p className="text-xs text-gray-400 font-600">Serviço completo</p>
              <p className="text-sm font-800 text-gray-800">Banho + Corte + Higiene</p>
            </div>
          </motion.div>

          {/* Rating badge */}
          <motion.div
            className="absolute top-8 right-[-20px] bg-white rounded-2xl px-4 py-3 shadow-xl"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            style={{ boxShadow: "0 8px 30px rgba(181,234,215,0.4)" }}
          >
            <p className="text-xs text-gray-400 font-600 mb-0.5">Avaliação</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-sm">★</span>
              ))}
              <span className="text-sm font-800 text-gray-800 ml-1">5.0</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40C360 80 1080 0 1440 40V80H0V40Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </div>
    </section>
  );
}
