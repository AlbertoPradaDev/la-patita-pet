import type { Metadata } from "next";
import Link from "next/link";
import BookingWizard from "@/components/Booking/BookingWizard";

export const metadata: Metadata = {
  title: "Reservas | La Patita Pet",
  description: "Marque a sua consulta de banho, corte, secagem ou higiene para o seu animal.",
};

export default function ReservasPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fff9f5 0%, #ffeee3 25%, #f9f0ff 60%, #e8f8f2 100%)",
      }}
    >
      {/* Back nav */}
      <div className="max-w-2xl mx-auto px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-700 text-gray-500 hover:text-[#9b8acb] transition-colors"
        >
          ← La Patita Pet
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-4 text-center">
        <span className="text-5xl mb-4 block">🐾</span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-3">
          Marque a sua{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #9b8acb, #5aad8a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            reserva
          </span>
        </h1>
        <p className="text-gray-500 font-500 text-base max-w-md mx-auto">
          Escolha o especialista, o serviço, o dia e o horário ideal para o seu animal.
        </p>
      </div>

      {/* Wizard card */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        <div
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10"
          style={{ boxShadow: "0 20px 60px rgba(199,184,234,0.2)" }}
        >
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}
