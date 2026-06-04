"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  apiFetch,
  formatearFecha,
  getProximasDosSemanas,
  DIAS_PT,
  MESES_PT,
  type Empleado,
  type Servicio,
  type DiaDisponible,
} from "@/lib/api";

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: "easeIn" as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/* ── Skeleton ── */
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-r from-[#f0eaff] via-[#e8f8f2] to-[#f0eaff] bg-[length:200%_100%] animate-pulse ${className}`}
    />
  );
}

/* ── Step indicator ── */
const PASOS = ["Especialista", "Serviço", "Dia", "Hora", "Confirmação"];

function StepIndicator({ atual }: { atual: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {PASOS.map((label, i) => {
        const num = i + 1;
        const done = num < atual;
        const active = num === atual;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-800 transition-all duration-300 ${
                  done
                    ? "bg-[#b5ead7] text-white"
                    : active
                    ? "bg-gradient-to-br from-[#b5ead7] to-[#c7b8ea] text-white shadow-lg scale-110"
                    : "bg-[#f0eaff] text-gray-400"
                }`}
              >
                {done ? "✓" : num}
              </div>
              <span
                className={`text-[10px] mt-1 font-600 hidden sm:block transition-colors ${
                  active ? "text-[#9b8acb]" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < PASOS.length - 1 && (
              <div
                className={`h-0.5 w-8 sm:w-12 mx-1 mb-4 sm:mb-0 rounded-full transition-all duration-500 ${
                  done ? "bg-[#b5ead7]" : "bg-[#e8e0f5]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Back button ── */
function BackBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#9b8acb] transition-colors mb-6 font-600"
    >
      ← {label}
    </button>
  );
}

/* ══════════════════════════════════════
   MAIN WIZARD
══════════════════════════════════════ */
export default function BookingWizard() {
  const [paso, setPaso] = useState(1);

  // selections
  const [especialistas, setEspecialistas] = useState<Empleado[]>([]);
  const [especialista, setEspecialista] = useState<Empleado | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [servicio, setServicio] = useState<Servicio | null>(null);
  const [dias, setDias] = useState<DiaDisponible[]>([]);
  const [dia, setDia] = useState<DiaDisponible | null>(null);
  const [huecos, setHuecos] = useState<string[]>([]);
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);
  const [hora, setHora] = useState<string | null>(null);

  // form
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  // loading states
  const [loadingEsp, setLoadingEsp] = useState(false);
  const [loadingSvc, setLoadingSvc] = useState(false);
  const [loadingDias, setLoadingDias] = useState(false);

  /* ── Step 1: load specialists on mount ── */
  const iniciar = useCallback(async () => {
    setLoadingEsp(true);
    const data = await apiFetch<{ empleados: Empleado[] }>("/api/empleados");
    setEspecialistas(data.empleados || []);
    setLoadingEsp(false);
  }, []);

  useState(() => { iniciar(); });

  /* ── Step 1 → 2 ── */
  const seleccionarEspecialista = async (emp: Empleado) => {
    setEspecialista(emp);
    setLoadingSvc(true);
    setPaso(2);
    const data = await apiFetch<{ servicios: Servicio[] }>(
      `/api/servicios?empleadoId=${emp.id}`
    );
    setServicios(data.servicios || []);
    setLoadingSvc(false);
  };

  /* ── Step 2 → 3 ── */
  const seleccionarServicio = async (svc: Servicio) => {
    setServicio(svc);
    setLoadingDias(true);
    setPaso(3);
    const fechas = getProximasDosSemanas().map(formatearFecha);
    const data = await apiFetch<{
      resultados: Array<{
        fecha: string;
        disponible: boolean;
        huecos: string[];
        horasOcupadas: string[];
      }>;
    }>("/api/disponibilidad-multiple", {
      method: "POST",
      body: JSON.stringify({
        fechas,
        servicioId: svc.id,
        empleadoId: especialista!.id,
      }),
    });
    const disponibles: DiaDisponible[] = (data.resultados || [])
      .filter((r) => r.disponible)
      .map((r) => ({ ...r, date: new Date(`${r.fecha}T12:00:00`) }));
    setDias(disponibles);
    setLoadingDias(false);
  };

  /* ── Step 3 → 4 ── */
  const seleccionarDia = (d: DiaDisponible) => {
    setDia(d);
    setHuecos(d.huecos);
    setHorasOcupadas(d.horasOcupadas);
    setPaso(4);
  };

  /* ── Step 4 → 5 ── */
  const seleccionarHora = (h: string) => {
    setHora(h);
    setPaso(5);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    const data = await apiFetch<{ error?: string }>("/api/citas", {
      method: "POST",
      body: JSON.stringify({
        nombreCliente: nombre,
        emailCliente: email,
        fecha: `${dia!.fecha}T${hora}:00`,
        servicioId: servicio!.id,
        empleadoId: especialista!.id,
      }),
    });
    setCargando(false);
    if (data.error) {
      setError(data.error);
    } else {
      setConfirmado(true);
    }
  };

  /* ── Reset ── */
  const resetear = () => {
    setConfirmado(false);
    setPaso(1);
    setEspecialista(null);
    setServicio(null);
    setDia(null);
    setHora(null);
    setHuecos([]);
    setHorasOcupadas([]);
    setNombre("");
    setEmail("");
    setError("");
    iniciar();
  };

  /* ══ CONFIRMADO ══ */
  if (confirmado) {
    const dDate = dia!.date;
    return (
      <motion.div
        className="text-center py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-6xl mb-6">🎉</div>
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-700 mb-4"
          style={{ background: "#e8f8f2", color: "#5aad8a" }}
        >
          ✅ Reserva confirmada!
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">
          Até{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #9b8acb, #5aad8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            breve
          </span>
          ! 🐾
        </h2>
        <p className="text-gray-500 font-500 mb-2">
          <strong className="text-gray-700">{servicio!.nombre}</strong> com{" "}
          <strong className="text-gray-700">{especialista!.nombre}</strong>
        </p>
        <p className="text-gray-500 font-500 mb-6">
          {DIAS_PT[dDate.getDay()]}, {dDate.getDate()} {MESES_PT[dDate.getMonth()]} · {hora}h ·{" "}
          {servicio!.duracion} min
          {servicio!.precio ? ` · ${servicio!.precio}€` : ""}
        </p>
        <p className="text-sm text-gray-400 font-500 mb-8">
          Enviámos os detalhes para <strong>{email}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetear}
            className="px-6 py-3 rounded-full text-sm font-800 text-white transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #b5ead7, #c7b8ea)" }}
          >
            + Nova reserva
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-sm font-700 text-gray-600 border-2 border-[#e8e0f5] hover:border-[#c7b8ea] hover:bg-[#f9f0ff] transition-all"
          >
            ← Voltar ao início
          </Link>
        </div>
      </motion.div>
    );
  }

  /* ══ WIZARD ══ */
  return (
    <div>
      <StepIndicator atual={paso} />

      <AnimatePresence mode="wait">
        {/* ── STEP 1: Especialista ── */}
        {paso === 1 && (
          <motion.div key="step1" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <h3 className="text-xl font-800 text-gray-800 mb-1">Escolha o seu especialista</h3>
            <p className="text-sm text-gray-400 font-500 mb-6">
              Selecione quem vai cuidar do seu animal
            </p>

            {loadingEsp ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : (
              <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                {especialistas.map((emp) => (
                  <motion.button
                    key={emp.id}
                    variants={cardItem}
                    onClick={() => seleccionarEspecialista(emp)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-[#e8e0f5] hover:border-[#c7b8ea] hover:bg-[#f9f0ff] transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                          style={{ background: "#e8f8f2" }}
                        >
                          🧴
                        </div>
                        <div>
                          <p className="font-800 text-gray-800">{emp.nombre}</p>
                          {emp.email && (
                            <p className="text-xs text-gray-400 font-500">{emp.email}</p>
                          )}
                        </div>
                      </div>
                      <span className="text-[#c7b8ea] opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                        →
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: Serviço ── */}
        {paso === 2 && (
          <motion.div key="step2" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <BackBtn label="Mudar especialista" onClick={() => setPaso(1)} />
            <h3 className="text-xl font-800 text-gray-800 mb-1">Escolha o serviço</h3>
            <p className="text-sm text-gray-400 font-500 mb-6">
              Para <strong className="text-gray-600">{especialista?.nombre}</strong>
            </p>

            {loadingSvc ? (
              <div className="space-y-3">
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
                <Skeleton className="h-20" />
              </div>
            ) : (
              <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                {servicios.map((svc) => (
                  <motion.button
                    key={svc.id}
                    variants={cardItem}
                    onClick={() => seleccionarServicio(svc)}
                    className="w-full text-left p-5 rounded-2xl border-2 border-[#e8e0f5] hover:border-[#b5ead7] hover:bg-[#e8f8f2] transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-800 text-gray-800">{svc.nombre}</p>
                        <p className="text-xs text-gray-400 font-600 mt-0.5">
                          {svc.duracion} min{svc.precio ? ` · ${svc.precio}€` : ""}
                        </p>
                      </div>
                      <span className="text-[#b5ead7] opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                        →
                      </span>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── STEP 3: Dia ── */}
        {paso === 3 && (
          <motion.div key="step3" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <BackBtn label="Mudar serviço" onClick={() => setPaso(2)} />
            <h3 className="text-xl font-800 text-gray-800 mb-1">Escolha o dia</h3>
            <p className="text-sm text-gray-400 font-500 mb-6">
              <strong className="text-gray-600">{servicio?.nombre}</strong> ·{" "}
              {servicio?.duracion} min
            </p>

            {loadingDias ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16" />
                ))}
              </div>
            ) : dias.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">😿</p>
                <p className="text-gray-500 font-600">
                  Sem disponibilidade para os próximos 14 dias.
                </p>
                <button
                  onClick={() => setPaso(2)}
                  className="mt-4 text-sm text-[#9b8acb] font-700 hover:underline"
                >
                  ← Escolher outro serviço
                </button>
              </div>
            ) : (
              <motion.div className="space-y-3" variants={stagger} initial="hidden" animate="show">
                {dias.map((d) => {
                  const dt = d.date;
                  return (
                    <motion.button
                      key={d.fecha}
                      variants={cardItem}
                      onClick={() => seleccionarDia(d)}
                      className="w-full text-left p-4 rounded-2xl border-2 border-[#e8e0f5] hover:border-[#ffd7e9] hover:bg-[#fff4f8] transition-all duration-200 group flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center"
                          style={{ background: "#ffd7e9" }}
                        >
                          <span className="text-[10px] font-800 text-pink-600 leading-none">
                            {MESES_PT[dt.getMonth()]}
                          </span>
                          <span className="text-sm font-900 text-pink-700 leading-none">
                            {dt.getDate()}
                          </span>
                        </div>
                        <div>
                          <p className="font-800 text-gray-800">
                            {DIAS_PT[dt.getDay()]}, {dt.getDate()} {MESES_PT[dt.getMonth()]}
                          </p>
                          <p className="text-xs text-gray-400 font-600">
                            {d.huecos.length} horários disponíveis
                          </p>
                        </div>
                      </div>
                      <span className="text-[#ffa0c0] opacity-0 group-hover:opacity-100 transition-opacity text-lg">
                        →
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ── STEP 4: Hora ── */}
        {paso === 4 && (
          <motion.div key="step4" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <BackBtn label="Mudar dia" onClick={() => setPaso(3)} />
            <h3 className="text-xl font-800 text-gray-800 mb-1">Escolha o horário</h3>
            {dia && (
              <p className="text-sm text-gray-400 font-500 mb-6">
                {DIAS_PT[dia.date.getDay()]}, {dia.date.getDate()} {MESES_PT[dia.date.getMonth()]}
              </p>
            )}

            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 gap-3"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Available */}
              {huecos.map((h) => (
                <motion.button
                  key={h}
                  variants={cardItem}
                  onClick={() => seleccionarHora(h)}
                  className="py-3 rounded-2xl border-2 border-[#e8e0f5] text-sm font-700 text-gray-700
                    hover:border-[#c7b8ea] hover:bg-[#f9f0ff] hover:text-[#9b8acb] transition-all duration-200"
                >
                  {h}
                </motion.button>
              ))}
              {/* Occupied */}
              {horasOcupadas.map((h) => (
                <div
                  key={h}
                  className="py-3 rounded-2xl border-2 border-[#f0eaff] text-sm font-600 text-gray-300 line-through cursor-not-allowed text-center"
                >
                  {h}
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* ── STEP 5: Confirmação ── */}
        {paso === 5 && (
          <motion.div key="step5" variants={fadeUp} initial="hidden" animate="show" exit="exit">
            <BackBtn label="Mudar horário" onClick={() => setPaso(4)} />
            <h3 className="text-xl font-800 text-gray-800 mb-6">Confirme a sua reserva</h3>

            {/* Summary */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background: "linear-gradient(135deg, #f9f0ff 0%, #e8f8f2 100%)",
                border: "2px solid #e8e0f5",
              }}
            >
              <p className="font-800 text-gray-800 text-base mb-1">{servicio?.nombre}</p>
              <p className="text-sm text-gray-500 font-500">
                {especialista?.nombre} · {dia && `${DIAS_PT[dia.date.getDay()]}, ${dia.date.getDate()} ${MESES_PT[dia.date.getMonth()]}`} · {hora}h
                {servicio && ` · ${servicio.duracion} min`}
                {servicio?.precio ? ` · ${servicio.precio}€` : ""}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-1 block">
                  Nome
                </label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="O seu nome"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#e8e0f5] bg-white text-gray-800 text-sm font-600
                    placeholder:text-gray-300 focus:outline-none focus:border-[#c7b8ea] focus:bg-[#faf8ff] transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-1 block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.seu@email.com"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#e8e0f5] bg-white text-gray-800 text-sm font-600
                    placeholder:text-gray-300 focus:outline-none focus:border-[#c7b8ea] focus:bg-[#faf8ff] transition-all"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-600 bg-red-50 px-4 py-2 rounded-xl">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                disabled={cargando}
                className="w-full py-4 rounded-2xl text-white font-800 text-base transition-all duration-300
                  hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                style={{
                  background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)",
                  boxShadow: "0 8px 25px rgba(181,234,215,0.4)",
                }}
              >
                {cargando ? "A confirmar..." : "🐾 Confirmar reserva"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
