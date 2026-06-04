"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  adminFetch, getToken, clearToken, getNegocio, setNegocio,
  formatarFechaYMD, formatarHora, formatarFechaHora, formatarFechaLegible,
  DIAS_SEMANA, DIAS_SEMANA_PT, MESES_PT_FULL, MESES_PT_CURTO, DIAS_SEMANA_HEADER,
  type Negocio, type Empleado, type Servicio, type Horario, type Pausa, type DiaBloqueado, type Cita,
} from "@/lib/adminAuth";

/* ══════════════════════════
   UI PRIMITIVES
══════════════════════════ */
const inputCls = "w-full px-4 py-2.5 rounded-2xl border-2 border-[#e8e0f5] bg-white text-gray-800 text-sm font-600 placeholder:text-gray-300 focus:outline-none focus:border-[#c7b8ea] focus:bg-[#faf8ff] transition-all";
const selectCls = inputCls + " cursor-pointer";

function Btn({ children, onClick, type = "button", variant = "primary", disabled, className = "" }: {
  children: React.ReactNode; onClick?: () => void; type?: "button"|"submit";
  variant?: "primary"|"danger"|"ghost"|"mint"; disabled?: boolean; className?: string;
}) {
  const styles: Record<string, string> = {
    primary: "bg-gradient-to-r from-[#b5ead7] to-[#c7b8ea] text-white shadow-md hover:shadow-lg",
    mint:    "bg-[#e8f8f2] text-[#5aad8a] hover:bg-[#d0f2e5]",
    danger:  "bg-[#ffeef0] text-[#e05070] hover:bg-[#ffd5db]",
    ghost:   "bg-[#f0eaff] text-[#9b8acb] hover:bg-[#e5deff]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`px-4 py-2 rounded-2xl text-sm font-700 transition-all duration-200 hover:scale-[1.03] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Badge({ estado }: { estado: string }) {
  const map: Record<string, string> = {
    pendiente:  "bg-[#fff4e8] text-[#e09050]",
    confirmada: "bg-[#e8f8f2] text-[#5aad8a]",
    cancelada:  "bg-[#f5f5f5] text-gray-400",
  };
  const labels: Record<string, string> = { pendiente:"Pendente", confirmada:"Confirmada", cancelada:"Cancelada" };
  return <span className={`px-3 py-1 rounded-full text-xs font-700 ${map[estado] ?? map.pendiente}`}>{labels[estado] ?? estado}</span>;
}

function Card({ children, className="" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(199,184,234,0.15)] ${className}`}>{children}</div>;
}

function SectionTitle({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <div className="w-8 h-0.5 rounded-full mb-2" style={{ background: "linear-gradient(90deg,#b5ead7,#c7b8ea)" }} />
      <h2 className="text-xl font-black text-gray-800">{emoji} {title}</h2>
      {sub && <p className="text-sm text-gray-400 font-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function Msg({ msg, type }: { msg: string; type: "ok"|"err" }) {
  if (!msg) return null;
  return (
    <div className={`px-4 py-3 rounded-2xl text-sm font-600 mb-4 ${type==="ok" ? "bg-[#e8f8f2] text-[#5aad8a] border border-[#b5ead7]" : "bg-[#ffeef0] text-[#e05070] border border-[#ffb3bf]"}`}>
      {type==="ok" ? "✓ " : "⚠️ "}{msg}
    </div>
  );
}

function Skeleton() {
  return <div className="h-14 bg-gradient-to-r from-[#f0eaff] via-[#e8f8f2] to-[#f0eaff] rounded-2xl animate-pulse" />;
}

/* ══════════════════════════
   CALENDAR
══════════════════════════ */
function MiniCalendario({ seleccionado, onChange, mes, onMes }: {
  seleccionado: string|null;
  onChange: (fecha: string|null) => void;
  mes: Date;
  onMes: (d: Date) => void;
}) {
  const hoy = formatarFechaYMD(new Date());
  const year = mes.getFullYear(), month = mes.getMonth();
  const primero = new Date(year, month, 1).getDay();
  const diasEnMes = new Date(year, month+1, 0).getDate();
  const celdas: (number|null)[] = Array(primero).fill(null);
  for (let i=1; i<=diasEnMes; i++) celdas.push(i);

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { const d = new Date(year, month-1, 1); onMes(d); }}
          className="w-7 h-7 rounded-full bg-[#f0eaff] text-[#9b8acb] text-sm hover:bg-[#e5deff] transition-all">‹</button>
        <span className="text-sm font-800 text-gray-700">{MESES_PT_FULL[month]} {year}</span>
        <button onClick={() => { const d = new Date(year, month+1, 1); onMes(d); }}
          className="w-7 h-7 rounded-full bg-[#f0eaff] text-[#9b8acb] text-sm hover:bg-[#e5deff] transition-all">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DIAS_SEMANA_HEADER.map(d => <div key={d} className="text-center text-[10px] font-700 text-gray-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {celdas.map((d, i) => {
          if (!d) return <div key={i} />;
          const fecha = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          const isHoy = fecha === hoy;
          const isSel = fecha === seleccionado;
          return (
            <button key={i} onClick={() => onChange(isSel ? null : fecha)}
              className={`text-xs h-7 w-full rounded-xl font-600 transition-all duration-150 ${
                isSel ? "text-white scale-105 shadow-md" :
                isHoy ? "border-2 border-[#c7b8ea] text-[#9b8acb]" :
                "text-gray-600 hover:bg-[#f0eaff]"
              }`}
              style={isSel ? { background:"linear-gradient(135deg,#b5ead7,#c7b8ea)" } : {}}>
              {d}
            </button>
          );
        })}
      </div>
      {seleccionado && (
        <button onClick={() => onChange(null)} className="mt-3 w-full text-xs text-gray-400 hover:text-[#e05070] font-600 transition-colors">
          Limpar filtro ×
        </button>
      )}
    </Card>
  );
}

/* ══════════════════════════
   EMPLOYEE SELECTOR
══════════════════════════ */
function SelectorFuncionario({ empleados, sel, onSel }: { empleados: Empleado[]; sel: Empleado|null; onSel: (e: Empleado) => void; }) {
  if (empleados.length === 0) return (
    <Card className="text-center py-8">
      <p className="text-gray-400 font-600 text-sm">Nenhum funcionário. Crie um primeiro na aba <strong>Funcionários</strong>.</p>
    </Card>
  );
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {empleados.map(e => (
        <button key={e.id} onClick={() => onSel(e)}
          className={`px-4 py-2 rounded-full text-sm font-700 transition-all duration-200 hover:scale-105 ${sel?.id===e.id ? "text-white shadow-md" : "bg-white text-gray-600 border-2 border-[#e8e0f5] hover:border-[#c7b8ea]"}`}
          style={sel?.id===e.id ? { background:"linear-gradient(135deg,#b5ead7,#c7b8ea)" } : {}}>
          {e.nombre}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════
   MAIN DASHBOARD
══════════════════════════ */
type Tab = "marcacoes"|"funcionarios"|"servicos"|"horarios"|"pausas"|"bloqueados"|"definicoes";

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id:"marcacoes",    emoji:"📅", label:"Marcações" },
  { id:"funcionarios", emoji:"👤", label:"Funcionários" },
  { id:"servicos",     emoji:"✂️", label:"Serviços" },
  { id:"horarios",     emoji:"🕐", label:"Horários" },
  { id:"pausas",       emoji:"☕", label:"Pausas" },
  { id:"bloqueados",   emoji:"🔒", label:"Dias bloqueados" },
  { id:"definicoes",   emoji:"⚙️", label:"Definições" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("marcacoes");
  const [negocio, setNegocioState] = useState<Negocio|null>(null);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);

  /* shared msg */
  const [msg, setMsg] = useState<{text:string;type:"ok"|"err"}|null>(null);
  const msgTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const mostrarMsg = useCallback((text: string, type: "ok"|"err") => {
    setMsg({text,type});
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => setMsg(null), 3500);
  }, []);

  /* auth check */
  useEffect(() => {
    if (!getToken()) { router.replace("/admin"); return; }
    const n = getNegocio();
    if (n) setNegocioState(n);
    adminFetch<{negocio:Negocio}>("/api/admin/dashboard").then(d => {
      if (d.negocio) { setNegocioState(d.negocio); setNegocio(d.negocio); }
    });
    cargarEmpleados();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarEmpleados = useCallback(async () => {
    const d = await adminFetch<{empleados:Empleado[]}>("/api/admin/empleados");
    setEmpleados(d.empleados || []);
  }, []);

  const cerrarSesion = () => { clearToken(); router.push("/admin"); };

  /* ── MARCAÇÕES ── */
  const [citas, setCitas] = useState<Cita[]>([]);
  const [totalCitas, setTotalCitas] = useState(0);
  const [fechaCalendario, setFechaCalendario] = useState<string|null>(null);
  const [mesCalendario, setMesCalendario] = useState(new Date());
  const [empFiltroCitas, setEmpFiltroCitas] = useState<string>("");
  const [citasPorPagina, setCitasPorPagina] = useState(10);
  const [paginaCitas, setPaginaCitas] = useState(0);
  const [loadingCitas, setLoadingCitas] = useState(false);

  const cargarCitas = useCallback(async () => {
    setLoadingCitas(true);
    const params = new URLSearchParams({ skip: String(paginaCitas * citasPorPagina), take: String(citasPorPagina) });
    if (fechaCalendario) params.set("fecha", fechaCalendario);
    else { const hoy = formatarFechaYMD(new Date()); params.set("fechaDesde", hoy); }
    if (empFiltroCitas) params.set("empleadoId", empFiltroCitas);
    const d = await adminFetch<{citas:Cita[];total:number}>(`/api/admin/citas?${params}`);
    setCitas(d.citas || []);
    setTotalCitas(d.total || 0);
    setLoadingCitas(false);
  }, [fechaCalendario, empFiltroCitas, citasPorPagina, paginaCitas]);

  useEffect(() => { if (tab==="marcacoes") cargarCitas(); }, [tab, cargarCitas]);

  const cambiarEstadoCita = async (id: number, estado: string) => {
    const d = await adminFetch<{error?:string}>(`/api/admin/citas?id=${id}`, { method:"PATCH", body:JSON.stringify({estado}) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Estado actualizado.","ok"); cargarCitas(); }
  };

  /* ── NOVA MARCAÇÃO ── */
  const [novaEmp, setNovaEmp] = useState("");
  const [novaServs, setNovaServs] = useState<Servicio[]>([]);
  const [novaSvc, setNovaSvc] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaHora, setNovaHora] = useState("");
  const [novaCliente, setNovaCliente] = useState("");
  const [novaEmail, setNovaEmail] = useState("");
  const [loadingSvcsNova, setLoadingSvcsNova] = useState(false);

  const onNovaEmpChange = async (empId: string) => {
    setNovaEmp(empId); setNovaSvc(""); setNovaServs([]);
    if (!empId) return;
    setLoadingSvcsNova(true);
    const d = await adminFetch<{servicios:Servicio[]}>(`/api/admin/servicios?empleadoId=${empId}`);
    setNovaServs(d.servicios || []);
    setLoadingSvcsNova(false);
  };

  const submitNovaMarcacao = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = await adminFetch<{error?:string}>("/api/admin/citas", {
      method:"POST",
      body: JSON.stringify({ nombreCliente:novaCliente, emailCliente:novaEmail, fecha:`${novaData}T${novaHora}:00`, servicioId:parseInt(novaSvc), empleadoId:parseInt(novaEmp) }),
    });
    if (d.error) mostrarMsg(d.error,"err");
    else {
      mostrarMsg("Marcação criada com sucesso!","ok");
      setNovaEmp(""); setNovaSvc(""); setNovaServs([]); setNovaData(""); setNovaHora(""); setNovaCliente(""); setNovaEmail("");
      cargarCitas();
    }
  };

  /* ── FUNCIONÁRIOS ── */
  const [novoEmp, setNovoEmp] = useState({ nombre:"", email:"", telefono:"" });
  const [editandoEmp, setEditandoEmp] = useState<Empleado|null>(null);

  const crearEmpleado = async (e: React.FormEvent) => {
    e.preventDefault();
    const d = await adminFetch<{error?:string}>("/api/admin/empleados", { method:"POST", body:JSON.stringify(novoEmp) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Funcionário adicionado!","ok"); setNovoEmp({nombre:"",email:"",telefono:""}); cargarEmpleados(); }
  };

  const guardarEmp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editandoEmp) return;
    const d = await adminFetch<{error?:string}>(`/api/admin/empleados?id=${editandoEmp.id}`, { method:"PATCH", body:JSON.stringify(editandoEmp) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Funcionário actualizado!","ok"); setEditandoEmp(null); cargarEmpleados(); }
  };

  const eliminarEmp = async (id: number) => {
    const d = await adminFetch<{error?:string}>(`/api/admin/empleados?id=${id}`, { method:"DELETE" });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Funcionário eliminado.","ok"); cargarEmpleados(); }
  };

  /* ── SERVIÇOS ── */
  const [empSvcSel, setEmpSvcSel] = useState<Empleado|null>(null);
  const [servicos, setServicos] = useState<Servicio[]>([]);
  const [novoSvc, setNovoSvc] = useState({ nombre:"", duracion:"", precio:"" });

  const cargarServicos = useCallback(async (emp: Empleado) => {
    const d = await adminFetch<{servicios:Servicio[]}>(`/api/admin/servicios?empleadoId=${emp.id}`);
    setServicos(d.servicios || []);
  }, []);

  useEffect(() => { if (empSvcSel) cargarServicos(empSvcSel); }, [empSvcSel, cargarServicos]);

  const criarSvc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empSvcSel) return;
    const body = { nombre:novoSvc.nombre, duracion:parseInt(novoSvc.duracion), ...(novoSvc.precio ? {precio:parseFloat(novoSvc.precio)} : {}), empleadoId:empSvcSel.id };
    const d = await adminFetch<{error?:string}>("/api/admin/servicios", { method:"POST", body:JSON.stringify(body) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Serviço adicionado!","ok"); setNovoSvc({nombre:"",duracion:"",precio:""}); cargarServicos(empSvcSel); }
  };

  const eliminarSvc = async (id: number) => {
    const d = await adminFetch<{error?:string}>(`/api/admin/servicios?id=${id}`, { method:"DELETE" });
    if (d.error) mostrarMsg("Não é possível eliminar este serviço — pode ter marcações associadas.","err");
    else { mostrarMsg("Serviço eliminado.","ok"); if (empSvcSel) cargarServicos(empSvcSel); }
  };

  /* ── HORÁRIOS ── */
  const [empHorSel, setEmpHorSel] = useState<Empleado|null>(null);
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [novoHor, setNovoHor] = useState({ diaSemana:"lunes", horaInicio:"", horaFin:"" });

  const cargarHorarios = useCallback(async (emp: Empleado) => {
    const d = await adminFetch<{horarios:Horario[]}>(`/api/admin/horarios?empleadoId=${emp.id}`);
    setHorarios(d.horarios || []);
  }, []);

  useEffect(() => { if (empHorSel) cargarHorarios(empHorSel); }, [empHorSel, cargarHorarios]);

  const criarHor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empHorSel) return;
    const d = await adminFetch<{error?:string}>("/api/admin/horarios", { method:"POST", body:JSON.stringify({...novoHor, empleadoId:empHorSel.id}) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Horário adicionado!","ok"); setNovoHor({diaSemana:"lunes",horaInicio:"",horaFin:""}); cargarHorarios(empHorSel); }
  };

  const eliminarHor = async (id: number) => {
    await adminFetch(`/api/admin/horarios?id=${id}`, { method:"DELETE" });
    mostrarMsg("Horário eliminado.","ok");
    if (empHorSel) cargarHorarios(empHorSel);
  };

  /* ── PAUSAS ── */
  const [empPauSel, setEmpPauSel] = useState<Empleado|null>(null);
  const [pausas, setPausas] = useState<Pausa[]>([]);
  const [novaPausa, setNovaPausa] = useState({ diaSemana:"lunes", horaInicio:"", horaFin:"" });

  const cargarPausas = useCallback(async (emp: Empleado) => {
    const d = await adminFetch<{pausas:Pausa[]}>(`/api/admin/pausas?empleadoId=${emp.id}`);
    setPausas(d.pausas || []);
  }, []);

  useEffect(() => { if (empPauSel) cargarPausas(empPauSel); }, [empPauSel, cargarPausas]);

  const criarPausa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empPauSel) return;
    const d = await adminFetch<{error?:string}>("/api/admin/pausas", { method:"POST", body:JSON.stringify({...novaPausa, empleadoId:empPauSel.id}) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Pausa adicionada!","ok"); setNovaPausa({diaSemana:"lunes",horaInicio:"",horaFin:""}); cargarPausas(empPauSel); }
  };

  const eliminarPausa = async (id: number) => {
    await adminFetch(`/api/admin/pausas?id=${id}`, { method:"DELETE" });
    mostrarMsg("Pausa eliminada.","ok");
    if (empPauSel) cargarPausas(empPauSel);
  };

  /* ── DIAS BLOQUEADOS ── */
  const [empBlqSel, setEmpBlqSel] = useState<Empleado|null>(null);
  const [diasBlq, setDiasBlq] = useState<DiaBloqueado[]>([]);
  const [novoBlq, setNovoBlq] = useState({ fecha:"", motivo:"" });

  const cargarDiasBlq = useCallback(async (emp: Empleado) => {
    const d = await adminFetch<{diasBloqueados:DiaBloqueado[]}>(`/api/admin/dias-bloqueados?empleadoId=${emp.id}`);
    setDiasBlq(d.diasBloqueados || []);
  }, []);

  useEffect(() => { if (empBlqSel) cargarDiasBlq(empBlqSel); }, [empBlqSel, cargarDiasBlq]);

  const criarBlq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empBlqSel) return;
    const d = await adminFetch<{error?:string}>("/api/admin/dias-bloqueados", { method:"POST", body:JSON.stringify({...novoBlq, empleadoId:empBlqSel.id}) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Dia bloqueado!","ok"); setNovoBlq({fecha:"",motivo:""}); cargarDiasBlq(empBlqSel); }
  };

  const desbloquear = async (id: number) => {
    await adminFetch(`/api/admin/dias-bloqueados?id=${id}`, { method:"DELETE" });
    mostrarMsg("Dia desbloqueado.","ok");
    if (empBlqSel) cargarDiasBlq(empBlqSel);
  };

  /* ── DEFINIÇÕES ── */
  const [pwActual, setPwActual] = useState(""); const [pwNova, setPwNova] = useState(""); const [pwConfirm, setPwConfirm] = useState("");

  const alterarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwNova !== pwConfirm) { mostrarMsg("As palavras-passe não coincidem.","err"); return; }
    const d = await adminFetch<{error?:string}>("/api/admin/password", { method:"PATCH", body:JSON.stringify({passwordActual:pwActual, passwordNueva:pwNova}) });
    if (d.error) mostrarMsg(d.error,"err");
    else { mostrarMsg("Senha alterada com sucesso!","ok"); setPwActual(""); setPwNova(""); setPwConfirm(""); }
  };

  /* ══════════════════════════
     RENDER TABS
  ══════════════════════════ */
  const hojeStr = formatarFechaYMD(new Date());

  const renderTab = () => {
    switch (tab) {

    /* ── TAB: MARCAÇÕES ── */
    case "marcacoes": return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: calendar + filters */}
        <div>
          <MiniCalendario seleccionado={fechaCalendario} onChange={(f) => { setFechaCalendario(f); setPaginaCitas(0); }}
            mes={mesCalendario} onMes={setMesCalendario} />
          <Card>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Funcionário</p>
            <select className={selectCls} value={empFiltroCitas} onChange={e => { setEmpFiltroCitas(e.target.value); setPaginaCitas(0); }}>
              <option value="">Todos os funcionários</option>
              {empleados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2 mt-4">Por página</p>
            <select className={selectCls} value={citasPorPagina} onChange={e => { setCitasPorPagina(parseInt(e.target.value)); setPaginaCitas(0); }}>
              {[10,20,50,100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <Btn className="w-full mt-4" onClick={cargarCitas}>🔄 Atualizar</Btn>
          </Card>
        </div>

        {/* Right: list */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-700 text-gray-600">
              {fechaCalendario ? `${totalCitas} marcações em ${fechaCalendario}` : `${totalCitas} marcações a partir de hoje`}
            </p>
          </div>

          {loadingCitas ? (
            <div className="space-y-3">{[...Array(4)].map((_,i) => <Skeleton key={i}/>)}</div>
          ) : citas.length === 0 ? (
            <Card className="text-center py-10"><p className="text-4xl mb-2">📭</p><p className="text-gray-400 font-600">Nenhuma marcação encontrada.</p></Card>
          ) : (
            <div className="space-y-3">
              {citas.map(c => (
                <Card key={c.id} className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-800 text-gray-800 uppercase text-sm truncate">{c.nombreCliente}</p>
                    <p className="text-xs text-gray-400 font-500 truncate mt-0.5">{c.emailCliente}</p>
                    <p className="text-xs text-[#9b8acb] font-600 mt-1">
                      {formatarFechaHora(c.fecha)} · {c.servicio.nombre} · {c.servicio.duracion}min · {c.empleado.nombre}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge estado={c.estado}/>
                    {c.estado!=="cancelada" && <Btn variant="danger" onClick={() => cambiarEstadoCita(c.id,"cancelada")}>Cancelar</Btn>}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalCitas > citasPorPagina && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <Btn variant="ghost" disabled={paginaCitas===0} onClick={() => setPaginaCitas(p => p-1)}>‹ Anterior</Btn>
              <span className="text-sm font-700 text-gray-500">{paginaCitas+1} / {Math.ceil(totalCitas/citasPorPagina)}</span>
              <Btn variant="ghost" disabled={(paginaCitas+1)*citasPorPagina>=totalCitas} onClick={() => setPaginaCitas(p => p+1)}>Próxima ›</Btn>
            </div>
          )}
        </div>
      </div>
    );

    /* ── TAB: FUNCIONÁRIOS ── */
    case "funcionarios": return (
      <div className="max-w-2xl space-y-6">
        <SectionTitle emoji="👤" title="Funcionários" />
        {/* List */}
        <div className="space-y-3">
          {empleados.map(e => (
            <Card key={e.id}>
              {editandoEmp?.id===e.id ? (
                <form onSubmit={guardarEmp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input required className={inputCls} value={editandoEmp.nombre} onChange={ev => setEditandoEmp({...editandoEmp, nombre:ev.target.value})} placeholder="Nome"/>
                  <input className={inputCls} value={editandoEmp.email||""} onChange={ev => setEditandoEmp({...editandoEmp, email:ev.target.value})} placeholder="Email"/>
                  <input className={inputCls} value={editandoEmp.telefono||""} onChange={ev => setEditandoEmp({...editandoEmp, telefono:ev.target.value})} placeholder="Telefone"/>
                  <div className="flex gap-2 sm:col-span-3">
                    <Btn type="submit" variant="mint">Guardar</Btn>
                    <Btn variant="ghost" onClick={() => setEditandoEmp(null)}>Cancelar</Btn>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-800 text-gray-800">{e.nombre}</p>
                    <p className="text-xs text-gray-400 font-500">{[e.email,e.telefono].filter(Boolean).join(" · ") || "—"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Btn variant="ghost" onClick={() => setEditandoEmp(e)}>Editar</Btn>
                    <Btn variant="danger" onClick={() => eliminarEmp(e.id)}>Eliminar</Btn>
                  </div>
                </div>
              )}
            </Card>
          ))}
          {empleados.length===0 && <Card className="text-center py-8 text-gray-400 font-600">Nenhum funcionário ainda.</Card>}
        </div>
        {/* Add form */}
        <Card>
          <p className="text-sm font-800 text-gray-700 mb-4">Adicionar funcionário</p>
          <form onSubmit={crearEmpleado} className="space-y-3">
            <input required className={inputCls} placeholder="Nome *" value={novoEmp.nombre} onChange={e => setNovoEmp({...novoEmp,nombre:e.target.value})}/>
            <div className="grid grid-cols-2 gap-3">
              <input className={inputCls} placeholder="Email" value={novoEmp.email} onChange={e => setNovoEmp({...novoEmp,email:e.target.value})}/>
              <input className={inputCls} placeholder="Telefone" value={novoEmp.telefono} onChange={e => setNovoEmp({...novoEmp,telefono:e.target.value})}/>
            </div>
            <Btn type="submit" className="w-full">➕ Adicionar funcionário →</Btn>
          </form>
        </Card>
      </div>
    );

    /* ── TAB: SERVIÇOS ── */
    case "servicos": return (
      <div className="max-w-2xl space-y-6">
        <SectionTitle emoji="✂️" title="Serviços" sub="Selecione um funcionário" />
        <SelectorFuncionario empleados={empleados} sel={empSvcSel} onSel={e => setEmpSvcSel(e)}/>
        {empSvcSel && (<>
          <div className="space-y-3">
            {servicos.map(s => (
              <Card key={s.id} className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-800 text-gray-800 uppercase text-sm">{s.nombre}</p>
                  <p className="text-xs text-gray-400 font-600">{s.duracion} min · {s.precio ? `${s.precio}€` : "Sem preço"}</p>
                </div>
                <Btn variant="danger" onClick={() => eliminarSvc(s.id)}>Eliminar</Btn>
              </Card>
            ))}
            {servicos.length===0 && <Card className="text-center py-6 text-gray-400 font-600">Nenhum serviço.</Card>}
          </div>
          <Card>
            <p className="text-sm font-800 text-gray-700 mb-4">Adicionar serviço</p>
            <form onSubmit={criarSvc} className="space-y-3">
              <input required className={inputCls} placeholder="Nome (ex: Corte, Banho...)" value={novoSvc.nombre} onChange={e => setNovoSvc({...novoSvc,nombre:e.target.value})}/>
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="1" className={inputCls} placeholder="Duração (min) *" value={novoSvc.duracion} onChange={e => setNovoSvc({...novoSvc,duracion:e.target.value})}/>
                <input type="number" min="0" step="0.01" className={inputCls} placeholder="Preço (€)" value={novoSvc.precio} onChange={e => setNovoSvc({...novoSvc,precio:e.target.value})}/>
              </div>
              <Btn type="submit" className="w-full">➕ Adicionar serviço →</Btn>
            </form>
          </Card>
        </>)}
      </div>
    );

    /* ── TAB: HORÁRIOS ── */
    case "horarios": return (
      <div className="max-w-2xl space-y-6">
        <SectionTitle emoji="🕐" title="Horários" sub="Horário semanal por funcionário" />
        <SelectorFuncionario empleados={empleados} sel={empHorSel} onSel={e => setEmpHorSel(e)}/>
        {empHorSel && (<>
          <div className="space-y-3">
            {horarios.map(h => (
              <Card key={h.id} className="flex items-center justify-between">
                <div>
                  <p className="font-800 text-gray-800">{DIAS_SEMANA_PT[DIAS_SEMANA.indexOf(h.diaSemana as typeof DIAS_SEMANA[number])]}</p>
                  <p className="text-xs text-gray-400 font-600">{h.horaInicio} — {h.horaFin}</p>
                </div>
                <Btn variant="danger" onClick={() => eliminarHor(h.id)}>Eliminar</Btn>
              </Card>
            ))}
            {horarios.length===0 && <Card className="text-center py-6 text-gray-400 font-600">Nenhum horário.</Card>}
          </div>
          <Card>
            <p className="text-sm font-800 text-gray-700 mb-4">Adicionar horário</p>
            <form onSubmit={criarHor} className="space-y-3">
              <select required className={selectCls} value={novoHor.diaSemana} onChange={e => setNovoHor({...novoHor,diaSemana:e.target.value})}>
                {DIAS_SEMANA.map((d,i) => <option key={d} value={d}>{DIAS_SEMANA_PT[i]}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400 font-600 mb-1 block">Início</label><input required type="time" step={600} className={inputCls} value={novoHor.horaInicio} onChange={e => setNovoHor({...novoHor,horaInicio:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 font-600 mb-1 block">Fim</label><input required type="time" step={600} className={inputCls} value={novoHor.horaFin} onChange={e => setNovoHor({...novoHor,horaFin:e.target.value})}/></div>
              </div>
              <Btn type="submit" className="w-full">➕ Adicionar horário →</Btn>
            </form>
          </Card>
        </>)}
      </div>
    );

    /* ── TAB: PAUSAS ── */
    case "pausas": return (
      <div className="max-w-2xl space-y-6">
        <SectionTitle emoji="☕" title="Pausas" sub="Intervalos dentro do horário" />
        <SelectorFuncionario empleados={empleados} sel={empPauSel} onSel={e => setEmpPauSel(e)}/>
        {empPauSel && (<>
          <div className="space-y-3">
            {pausas.map(p => (
              <Card key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="font-800 text-gray-800">{DIAS_SEMANA_PT[DIAS_SEMANA.indexOf(p.diaSemana as typeof DIAS_SEMANA[number])]}</p>
                  <p className="text-xs text-gray-400 font-600">{p.horaInicio} — {p.horaFin}</p>
                </div>
                <Btn variant="danger" onClick={() => eliminarPausa(p.id)}>Eliminar</Btn>
              </Card>
            ))}
            {pausas.length===0 && <Card className="text-center py-6 text-gray-400 font-600">Nenhuma pausa.</Card>}
          </div>
          <Card>
            <p className="text-sm font-800 text-gray-700 mb-4">Adicionar pausa</p>
            <form onSubmit={criarPausa} className="space-y-3">
              <select required className={selectCls} value={novaPausa.diaSemana} onChange={e => setNovaPausa({...novaPausa,diaSemana:e.target.value})}>
                {DIAS_SEMANA.map((d,i) => <option key={d} value={d}>{DIAS_SEMANA_PT[i]}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-400 font-600 mb-1 block">Início</label><input required type="time" step={600} className={inputCls} value={novaPausa.horaInicio} onChange={e => setNovaPausa({...novaPausa,horaInicio:e.target.value})}/></div>
                <div><label className="text-xs text-gray-400 font-600 mb-1 block">Fim</label><input required type="time" step={600} className={inputCls} value={novaPausa.horaFin} onChange={e => setNovaPausa({...novaPausa,horaFin:e.target.value})}/></div>
              </div>
              <p className="text-xs text-gray-400 font-500">A pausa deve estar dentro do horário do dia selecionado.</p>
              <Btn type="submit" className="w-full">➕ Adicionar pausa →</Btn>
            </form>
          </Card>
        </>)}
      </div>
    );

    /* ── TAB: DIAS BLOQUEADOS ── */
    case "bloqueados": return (
      <div className="max-w-2xl space-y-6">
        <SectionTitle emoji="🔒" title="Dias bloqueados" sub="Feriados, férias ou indisponibilidade" />
        <SelectorFuncionario empleados={empleados} sel={empBlqSel} onSel={e => setEmpBlqSel(e)}/>
        {empBlqSel && (<>
          <div className="space-y-3">
            {diasBlq.map(d => (
              <Card key={d.id} className="flex items-center justify-between">
                <div>
                  <p className="font-800 text-gray-800">{formatarFechaLegible(d.fecha)}</p>
                  {d.motivo && <p className="text-xs text-gray-400 font-500">{d.motivo}</p>}
                </div>
                <Btn variant="danger" onClick={() => desbloquear(d.id)}>Desbloquear</Btn>
              </Card>
            ))}
            {diasBlq.length===0 && <Card className="text-center py-6 text-gray-400 font-600">Nenhum dia bloqueado.</Card>}
          </div>
          <Card>
            <p className="text-sm font-800 text-gray-700 mb-4">Bloquear dia</p>
            <form onSubmit={criarBlq} className="space-y-3">
              <input required type="date" min={hojeStr} className={inputCls} value={novoBlq.fecha} onChange={e => setNovoBlq({...novoBlq,fecha:e.target.value})}/>
              <input className={inputCls} placeholder="Motivo (opcional) — Feriado, férias..." value={novoBlq.motivo} onChange={e => setNovoBlq({...novoBlq,motivo:e.target.value})}/>
              <Btn type="submit" className="w-full">🔒 Bloquear dia →</Btn>
            </form>
          </Card>
        </>)}
      </div>
    );

    /* ── TAB: DEFINIÇÕES ── */
    case "definicoes": return (
      <div className="max-w-md space-y-6">
        <SectionTitle emoji="⚙️" title="Definições" />
        {negocio && (
          <Card>
            <p className="text-xs font-700 text-gray-400 uppercase tracking-wider mb-3">Conta</p>
            <p className="font-800 text-gray-800">{negocio.nombre}</p>
            <p className="text-sm text-gray-400 font-500">{negocio.email}</p>
          </Card>
        )}
        <Card>
          <p className="text-sm font-800 text-gray-700 mb-4">Alterar palavra-passe</p>
          <form onSubmit={alterarPassword} className="space-y-3">
            <input required type="password" className={inputCls} placeholder="Senha atual" value={pwActual} onChange={e => setPwActual(e.target.value)}/>
            <input required type="password" minLength={8} className={inputCls} placeholder="Nova senha (mín. 8 caracteres)" value={pwNova} onChange={e => setPwNova(e.target.value)}/>
            <input required type="password" minLength={8} className={inputCls} placeholder="Confirmar nova senha" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)}/>
            <Btn type="submit" className="w-full">🔑 Alterar palavra-passe →</Btn>
          </form>
        </Card>
        <Card>
          <p className="text-sm font-800 text-gray-700 mb-3">Sessão</p>
          <Btn variant="danger" onClick={cerrarSesion} className="w-full">Terminar sessão</Btn>
        </Card>
      </div>
    );

    default: return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background:"linear-gradient(135deg,#fff9f5 0%,#ffeee3 15%,#f9f0ff 50%,#e8f8f2 100%)" }}>

      {/* TOP BAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#f0eaff] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐾</span>
            <div>
              <p className="font-black text-gray-800 leading-none text-sm">La <span className="text-[#9b8acb]">Patita</span> Pet</p>
              <p className="text-[10px] text-gray-400 font-600">Admin</p>
            </div>
          </div>
          {/* Desktop tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-700 transition-all duration-200 ${tab===t.id ? "text-white shadow-sm" : "text-gray-500 hover:bg-[#f0eaff]"}`}
                style={tab===t.id ? { background:"linear-gradient(135deg,#b5ead7,#c7b8ea)" } : {}}>
                {t.emoji} {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a href="/" className="text-xs text-gray-400 hover:text-[#9b8acb] font-600 hidden sm:block transition-colors">← Site</a>
            <Btn variant="danger" onClick={cerrarSesion} className="!px-3 !py-1.5 !text-xs">Sair</Btn>
          </div>
        </div>
        {/* Mobile tabs */}
        <div className="lg:hidden flex gap-1 px-4 pb-3 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-2xl text-xs font-700 transition-all ${tab===t.id ? "text-white" : "bg-[#f0eaff] text-gray-500"}`}
              style={tab===t.id ? { background:"linear-gradient(135deg,#b5ead7,#c7b8ea)" } : {}}>
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Global message */}
        {msg && <Msg msg={msg.text} type={msg.type}/>}
        {renderTab()}
      </main>
    </div>
  );
}
