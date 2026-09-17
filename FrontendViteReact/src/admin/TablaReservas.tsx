import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Clock3, BedDouble, Trophy, DoorOpen, Wallet } from 'lucide-react';
import { getFechaLocal } from '../utils/fecha';

interface Reserva {
  id: number;
  habitacion: number;
  valor: number;
  fecha: string;
  hentrada: string;
  colaborador: string;
}

interface Cuadre {
  turno: string;
  turnoCerrado: string;
  basecaja: number;
  totalActual?: number;
  fecha: string;
  colaborador: string;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const COLORES_RANKING = ['#f59e0b', '#22d3ee', '#6366f1', '#f43f5e', '#10b981', '#a855f7', '#eab308'];

const formatMoney = (v: number) => `$${Math.round(v || 0).toLocaleString('es-CO')}`;

// Turnos: Mañana 07:00-14:00, Tarde 14:00-21:00, Noche 21:00-07:00 (ver FormularioTurno.tsx).
const turnoDeHora = (hentrada: string) => {
  const hora = parseInt((hentrada || '').split(':')[0], 10);
  if (hora >= 7 && hora < 14) return '07:00';
  if (hora >= 14 && hora < 21) return '14:00';
  return '21:00';
};

// Tooltip con estilo "glass" oscuro coherente con el resto del dashboard, y valores en pesos.
const TooltipDinero = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-slate-900/95 border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="font-bold" style={{ color: p.color || p.fill }}>
          {formatMoney(p.value)}
        </p>
      ))}
    </div>
  );
};

// Panel estilo "tarjeta de BI": encabezado con ícono + título + subtítulo, y el gráfico debajo.
const ChartPanel = ({
  icon: Icon,
  titulo,
  subtitulo,
  accent,
  children,
}: {
  icon: any;
  titulo: string;
  subtitulo?: string;
  accent: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl shadow-lg overflow-hidden">
    <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-white truncate">{titulo}</h3>
        {subtitulo && <p className="text-xs text-slate-400 truncate">{subtitulo}</p>}
      </div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const KpiCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  accent: string;
}) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ backgroundColor: `${accent}22`, color: accent }}
    >
      <Icon size={20} />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg font-bold text-white truncate">{value}</p>
    </div>
  </div>
);

const TablaReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cuadres, setCuadres] = useState<Cuadre[]>([]);
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [anio, setAnio] = useState<number>(new Date().getFullYear());
  const [fechaTurno, setFechaTurno] = useState<string>(getFechaLocal());
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [res, cuad] = await Promise.all([api.get('/reservas'), api.get('/cuadre')]);
      setReservas(res.data);
      setCuadres(cuad.data);
      setError(null);
    } catch (err) {
      console.error('Error cargando datos del panel de reservas:', err);
      setError('No se pudieron cargar los datos. Intenta de nuevo.');
    }
  };

  // El turno activo cambia en tiempo real (nuevas reservas, cierres de caja)
  // mientras esta pestaña permanece abierta, así que hay que refrescar
  // periódicamente y no solo al montar el componente.
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const resetearReservas = async () => {
    if (!window.confirm('¿Estás seguro de borrar todas las reservas y reiniciar los IDs?')) return;
    try {
      await api.delete('/reservas/reset-todo-456');
      alert('Reservas reseteadas correctamente');
      fetchData();
    } catch (error) {
      console.error('Error al resetear reservas:', error);
      alert('Error al resetear reservas. Consulta la consola para más detalles.');
    }
  };

  const reservasDelMes = useMemo(
    () =>
      reservas.filter((r) => {
        const fecha = new Date(r.fecha);
        return fecha.getMonth() + 1 === mes && fecha.getFullYear() === anio;
      }),
    [reservas, mes, anio]
  );

  const datosIngresosMes = useMemo(() => {
    const acc: Record<string, { mes: string; total: number; orden: string }> = {};
    reservas.forEach((r) => {
      const fecha = new Date(r.fecha);
      if (fecha.getFullYear() !== anio) return;
      const orden = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      const label = MESES[fecha.getMonth()].slice(0, 3);
      if (!acc[orden]) acc[orden] = { mes: label, total: 0, orden };
      acc[orden].total += Number(r.valor) || 0;
    });
    return Object.values(acc).sort((a, b) => a.orden.localeCompare(b.orden));
  }, [reservas, anio]);

  const datosTurno = useMemo(
    () =>
      ['07:00', '14:00', '21:00'].map((turno) => {
        const total = reservas.reduce((acc, r) => {
          return r.fecha === fechaTurno && turnoDeHora(r.hentrada) === turno ? acc + Number(r.valor) : acc;
        }, 0);
        return { turno, total };
      }),
    [reservas, fechaTurno]
  );

  const datosHabUso = useMemo(() => {
    const acc: Record<number, { habitacion: number; cantidad: number }> = {};
    reservasDelMes.forEach((r) => {
      if (!acc[r.habitacion]) acc[r.habitacion] = { habitacion: r.habitacion, cantidad: 0 };
      acc[r.habitacion].cantidad++;
    });
    return Array.from({ length: 16 }, (_, i) => i + 1).map(
      (num) => acc[num] || { habitacion: num, cantidad: 0 }
    );
  }, [reservasDelMes]);
  const maxHabUso = Math.max(0, ...datosHabUso.map((d) => d.cantidad));

  const rankingColaboradores = useMemo(() => {
    const acc: Record<string, number> = {};
    reservasDelMes.forEach((r) => {
      const nombre = r.colaborador || 'Sin asignar';
      acc[nombre] = (acc[nombre] || 0) + (Number(r.valor) || 0);
    });
    return Object.entries(acc)
      .map(([colaborador, total]) => ({ colaborador, total }))
      .sort((a, b) => b.total - a.total);
  }, [reservasDelMes]);
  const colaboradorLider = rankingColaboradores[0];

  const totalMesActual = useMemo(
    () => reservasDelMes.reduce((acc, r) => acc + (Number(r.valor) || 0), 0),
    [reservasDelMes]
  );

  const hoy = getFechaLocal();

  // El turno activo no persiste sus ventas en la BD (totalActual nunca se
  // escribe durante el turno), así que se calculan en vivo igual que en
  // ActividadAdmin.tsx: sumando las reservas del colaborador con caja abierta.
  const cuadreActivo = useMemo(
    () => cuadres.find((c) => c.fecha === hoy && !c.turnoCerrado),
    [cuadres, hoy]
  );

  const totalTurnoActivo = useMemo(() => {
    if (!cuadreActivo) return 0;
    return reservas
      .filter((r) => r.colaborador === cuadreActivo.colaborador && r.fecha === hoy)
      .reduce((acc, r) => acc + (Number(r.valor) || 0), 0);
  }, [reservas, cuadreActivo, hoy]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}

      {/* FILTROS */}
      <div className="flex flex-wrap items-end gap-3 bg-white/[0.03] border border-white/10 rounded-2xl p-4">
        <div className="flex flex-col">
          <label className="block text-xs text-slate-400 font-medium mb-1">Mes</label>
          <select
            className="bg-slate-800 text-white text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
          >
            {MESES.map((nombre, i) => (
              <option key={i + 1} value={i + 1}>{nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="block text-xs text-slate-400 font-medium mb-1">Año</label>
          <input
            type="number"
            className="bg-slate-800 text-white text-sm rounded-lg border border-white/10 px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={anio}
            onChange={(e) => setAnio(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-xs text-slate-400 font-medium mb-1">Fecha Turno</label>
          <input
            type="date"
            className="bg-slate-800 text-white text-sm rounded-lg border border-white/10 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={fechaTurno}
            onChange={(e) => setFechaTurno(e.target.value)}
          />
        </div>
        <button
          className="ml-auto bg-rose-600/90 hover:bg-rose-600 text-white text-sm font-semibold rounded-lg px-4 py-2 transition-colors"
          onClick={resetearReservas}
        >
          Resetear Reservas
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard icon={Wallet} label="Turno Activo" value={formatMoney(totalTurnoActivo)} accent="#10b981" />
        <KpiCard
          icon={TrendingUp}
          label={`Ingresos ${MESES[mes - 1]}`}
          value={formatMoney(totalMesActual)}
          accent="#6366f1"
        />
        <KpiCard
          icon={DoorOpen}
          label={`Reservas ${MESES[mes - 1]}`}
          value={reservasDelMes.length}
          accent="#22d3ee"
        />
        <KpiCard
          icon={Trophy}
          label="Colaborador Líder"
          value={colaboradorLider ? `${colaboradorLider.colaborador}` : 'Sin datos'}
          accent="#f59e0b"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartPanel icon={TrendingUp} titulo="Ingresos por Mes" subtitulo={`Año ${anio}`} accent="#10b981">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={datosIngresosMes} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="mes" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<TooltipDinero />} />
              <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={2} fill="url(#gradIngresos)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={Clock3}
          titulo="Ingresos por Turno"
          subtitulo={`Turnos del ${fechaTurno}`}
          accent="#6366f1"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={datosTurno} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="turno" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip content={<TooltipDinero />} cursor={{ fill: '#ffffff08' }} />
              <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={BedDouble}
          titulo="Habitaciones Más Usadas"
          subtitulo={`${MESES[mes - 1]} ${anio} · reservas por habitación`}
          accent="#22d3ee"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={datosHabUso} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="habitacion" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: '#ffffff08' }}
                content={({ active, payload, label }: any) =>
                  active && payload?.length ? (
                    <div className="bg-slate-900/95 border border-white/10 rounded-lg px-3 py-2 shadow-xl text-xs">
                      <p className="text-slate-400 mb-1">Habitación {label}</p>
                      <p className="font-bold text-cyan-400">{payload[0].value} reservas</p>
                    </div>
                  ) : null
                }
              />
              <Bar dataKey="cantidad" radius={[8, 8, 0, 0]} maxBarSize={28}>
                {datosHabUso.map((d, i) => (
                  <Cell key={i} fill={d.cantidad === maxHabUso && maxHabUso > 0 ? '#f59e0b' : '#22d3ee'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          icon={Trophy}
          titulo="Ranking de Colaboradores"
          subtitulo={`${MESES[mes - 1]} ${anio} · total entregado por colaborador`}
          accent="#f59e0b"
        >
          {rankingColaboradores.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-slate-500">
              No hay reservas registradas en este período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(220, rankingColaboradores.length * 40)}>
              <BarChart
                data={rankingColaboradores}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 10, bottom: 0 }}
              >
                <CartesianGrid stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="colaborador"
                  type="category"
                  stroke="#cbd5e1"
                  fontSize={12}
                  fontWeight={600}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip content={<TooltipDinero />} cursor={{ fill: '#ffffff08' }} />
                <Bar dataKey="total" radius={[0, 8, 8, 0]} maxBarSize={26}>
                  {rankingColaboradores.map((_, i) => (
                    <Cell key={i} fill={COLORES_RANKING[i % COLORES_RANKING.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>
    </div>
  );
};

export default TablaReservas;
