"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { isAdminConfigured } from "@/lib/adminAuth";

export default function SetupPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [cargando, setCargando] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    isAdminConfigured().then((configurado) => {
      if (configurado) router.replace("/admin");
      else setVerificando(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setError("As senhas não coincidem.");
      return;
    }
    setCargando(true);
    const data = await apiFetch<{ error?: string; mensaje?: string }>(
      "/api/admin/setup",
      {
        method: "POST",
        body: JSON.stringify({
          apiKey: process.env.NEXT_PUBLIC_API_KEY,
          password,
        }),
      }
    );
    setCargando(false);
    if (data.error) {
      setError(data.error);
    } else {
      router.push("/admin");
    }
  };

  if (verificando) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #fff9f5, #f9f0ff, #e8f8f2)" }}>
        <div className="text-4xl animate-pulse">🐾</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #fff9f5 0%, #ffeee3 25%, #f9f0ff 60%, #e8f8f2 100%)" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl block mb-4">🔐</span>
          <h1 className="text-3xl font-black text-gray-800 mb-2">
            Configurar{" "}
            <span style={{ background: "linear-gradient(135deg, #9b8acb, #5aad8a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              acesso
            </span>
          </h1>
          <p className="text-gray-500 font-500 text-sm">
            Defina a senha de administrador para <strong>La Patita Pet</strong>
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8"
          style={{ boxShadow: "0 20px 60px rgba(199,184,234,0.2)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-1.5 block">
                Senha
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#e8e0f5] bg-white text-gray-800 text-sm font-600
                  placeholder:text-gray-300 focus:outline-none focus:border-[#c7b8ea] focus:bg-[#faf8ff] transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-1.5 block">
                Confirmar Senha
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-3 rounded-2xl border-2 border-[#e8e0f5] bg-white text-gray-800 text-sm font-600
                  placeholder:text-gray-300 focus:outline-none focus:border-[#c7b8ea] focus:bg-[#faf8ff] transition-all"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-600 bg-red-50 px-4 py-2.5 rounded-xl">
                ⚠️ {error}
              </p>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-4 rounded-2xl text-white font-800 text-base transition-all duration-300
                hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:scale-100"
              style={{ background: "linear-gradient(135deg, #b5ead7 0%, #c7b8ea 100%)", boxShadow: "0 8px 25px rgba(181,234,215,0.4)" }}
            >
              {cargando ? "A configurar..." : "🔑 Definir senha"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
