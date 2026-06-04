"use client";

import { motion } from "framer-motion";

// 📍 Reemplaza estas coordenadas con tu dirección real
const MAP_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3115.554169993992!2d-9.0837096237982!3d38.65913037177586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19378463b7ebdd%3A0x6d7dfa701c35d474!2sLa%20Patita%20Pet%20Spa!5e0!3m2!1ses!2spt!4v1780442803567!5m2!1ses!2spt";
const contactInfo = [
  {
    emoji: "📍",
    label: "Morada",
    value: "Calle",
    bg: "#ffd7e9",
  },
  {
    emoji: "📞",
    label: "Telefone",
    value: "+351 300 000 000",
    bg: "#b5ead7",
  },
  {
    emoji: "🕐",
    label: "Horário",
    value: "Seg–Sáb: 8h – 18h",
    bg: "#c7b8ea",
  },
  {
    emoji: "📧",
    label: "E-mail",
    value: "ola@lapatitapet.com",
    bg: "#aec6cf",
  },
];

export default function MapSection() {
  return (
    <section
      id="contacto"
      className="py-24 px-6 bg-white relative overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #5aad8a 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4"
            style={{ background: "#ffd7e9", color: "#c0607a" }}
          >
            📍 Encontre-nos
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">
            Visite-nos quando{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #c7b8ea, #b5ead7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              quiser
            </span>
          </h2>
          <p className="text-lg text-gray-500 font-500 max-w-xl mx-auto">
            Estamos num lugar fácil de encontrar, com estacionamento e acesso cómodo
            para si e para o seu animal.
          </p>
        </motion.div>

        {/* Grid: map + contact cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Map — takes 2/3 */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="w-full h-[420px] rounded-3xl overflow-hidden relative"
              style={{
                boxShadow: "0 16px 50px rgba(199,184,234,0.3)",
              }}
            >
              {/* Map iframe */}
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación La Patita Pet"
              />

              {/* Overlay badge */}
              <div
                className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-2"
              >
                <span className="text-xl">🐾</span>
                <div>
                  <p className="text-xs text-gray-400 font-600 leading-none">Estamos aqui</p>
                  <p className="text-sm font-800 text-gray-800">La Patita Pet</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact info cards — 1/3 */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {contactInfo.map((c, i) => (
              <motion.div
                key={c.label}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  boxShadow: "0 4px 16px rgba(199,184,234,0.15)",
                  borderLeft: `4px solid ${c.bg}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.5 }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: c.bg }}
                >
                  {c.emoji}
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-600 mb-0.5">{c.label}</p>
                  <p className="text-sm font-700 text-gray-800">{c.value}</p>
                </div>
              </motion.div>
            ))}

            {/* CTA card */}
            <motion.a
              href="/reservas"
              className="mt-2 flex items-center justify-center gap-2 p-5 rounded-2xl text-white font-800 text-base hover:scale-[1.02] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)",
                boxShadow: "0 8px 25px rgba(181,234,215,0.4)",
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              📅 Marcar consulta agora
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
