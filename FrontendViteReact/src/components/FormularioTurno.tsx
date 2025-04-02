import { useState, useEffect } from 'react';

interface Props {
  onSubmit: (data: {
    colaborador: string;
    turno: string;
    fecha: string;
    userId: number;
    basecaja: number;
  }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const [baseCaja, setBaseCaja] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const fechaActual = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userId');
    if (username) setColaborador(username);
    if (id) setUserId(Number(id));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseCajaNum = Number(baseCaja);
    if (!colaborador || !turno || userId === null || isNaN(baseCajaNum)) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Guardar turno en localStorage
    localStorage.setItem('datosTurno', JSON.stringify({
      colaborador,
      fecha: fechaActual,
      turno
    }));

    onSubmit({ colaborador, turno, fecha: fechaActual, userId, basecaja: baseCajaNum });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5 max-w-md mx-auto bg-[#1f2937] text-white p-6 rounded-lg shadow-lg border border-gray-600">
      <h3 className="mb-6 text-2xl font-semibold text-center text-[#38bdf8]">Inicio de Turno - Invitado</h3>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-300">Colaborador</label>
        <input
          type="text"
          className="w-full p-2 rounded bg-[#111827] border border-gray-600 text-white"
          value={colaborador}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-300">Turno</label>
        <input
          type="time"
          className="w-full p-2 rounded bg-[#111827] border border-gray-600 text-white"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 text-sm text-gray-300">Base de Caja</label>
        <input
          type="number"
          className="w-full p-2 rounded bg-[#111827] border border-gray-600 text-white"
          value={baseCaja}
          onChange={(e) => setBaseCaja(e.target.value)}
          required
        />
      </div>

      <div className="mb-6">
        <label className="block mb-1 text-sm text-gray-300">Fecha</label>
        <input
          type="date"
          className="w-full p-2 rounded bg-[#111827] border border-gray-600 text-white"
          value={fechaActual}
          disabled
        />
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-[#38bdf8] text-black hover:bg-[#0ea5e9] font-semibold px-6 py-2 rounded transition-colors"
        >
          Iniciar Turno
        </button>
      </div>
    </form>
  );
};

export default FormularioTurno;