import { useState, useEffect } from 'react';

interface Props {
  onSubmit: (data: { colaborador: string; turno: string; fecha: string }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const fechaActual = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (username) setColaborador(username);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaborador || !turno) {
      alert('Por favor complete todos los campos');
      return;
    }
    onSubmit({ colaborador, turno, fecha: fechaActual });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5 max-w-md mx-auto bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-red-600">
      <h3 className="mb-4 text-xl font-semibold text-center text-red-500">Inicio de Turno - Invitado</h3>

      <div className="mb-4">
        <label className="form-label text-white">Colaborador</label>
        <input
          type="text"
          className="form-control bg-black text-white border-red-500"
          value={colaborador}
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="form-label text-white">Turno</label>
        <input
          type="time"
          className="form-control bg-black text-white border-red-500"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="form-label text-white">Fecha</label>
        <input
          type="date"
          className="form-control bg-black text-white border-red-500"
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