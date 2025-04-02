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
      fecha: fechaActual
    }));

    // Enviar datos
    onSubmit({ colaborador, turno, fecha: fechaActual, userId, basecaja: baseCajaNum });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5 max-w-md mx-auto bg-gray-900 backdrop-blur-md p-6 rounded-xl shadow-lg border border-red-600">
      <h3 className="mb-4 text-xl font-semibold text-center text-red-500">Inicio de Turno - Invitado</h3>

      <div className="mb-4">
        <label className="form-label">Colaborador</label>
        <input
          type="text"
          className="form-control bg-gray-900 border-red-500"
          value={colaborador}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Turno</label>
        <input
          type="time"
          className="form-control bg-gray-900 border-red-500"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Base de Caja</label>
        <input
          type="number"
          className="form-control bg-gray-900 border-red-500"
          value={baseCaja}
          onChange={(e) => setBaseCaja(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label text-white">Fecha</label>
        <input
          type="date"
          className="form-control bg-gray-900 border-red-500"
          value={fechaActual}
          disabled
        />
      </div>

      <div className="text-center">
        <button type="submit" className="btn btn-danger px-4 py-2 font-semibold rounded">
          Iniciar Turno
        </button>
      </div>
    </form>
  );
};

export default FormularioTurno;