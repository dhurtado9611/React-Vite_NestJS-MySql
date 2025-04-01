import { useState } from 'react';

interface Props {
  onSubmit: (data: { colaborador: string; turno: string; fecha: string }) => void;
}

const FormularioTurno = ({ onSubmit }: Props) => {
  const [colaborador, setColaborador] = useState('');
  const [turno, setTurno] = useState('');
  const fechaActual = new Date().toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colaborador || !turno) {
      alert('Por favor complete todos los campos');
      return;
    }
    onSubmit({ colaborador, turno, fecha: fechaActual });
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5">
      <h3 className="mb-4">Inicio de Turno - Invitado</h3>

      <div className="mb-3">
        <label className="form-label">Colaborador</label>
        <select
          className="form-control"
          value={colaborador}
          onChange={(e) => setColaborador(e.target.value)}
          required
        >
          <option value="">Seleccione...</option>
          <option value="Fabian">Fabian</option>
          <option value="Tatiana">Tatiana</option>
          <option value="Paola">Paola</option>
          <option value="Franci">Franci</option>
          <option value="Maria">Maria</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Turno</label>
        <input
          type="time"
          className="form-control"
          value={turno}
          onChange={(e) => setTurno(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          className="form-control"
          value={fechaActual}
          disabled
        />
      </div>

      <button type="submit" className="btn btn-primary">Iniciar Turno</button>
    </form>
  );
};

export default FormularioTurno;