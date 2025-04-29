import { useState, ChangeEvent } from 'react';

interface InventarioData {
  AGUARDIENTE: number;
  RON: number;
  POKER: number;
  ENERGIZANTE: number;
  JUGOS_HIT: number;
  AGUA: number;
  GASEOSA: number;
  PAPEL_HIGIENICO: number;
  ALKA_SELTZER: number;
  SHAMPOO: number;
  TOALLA_HIGIENICA: number;
  CONDONES: number;
  BONOS: number;
}

interface InventarioModalProps {
  show: boolean;
  handleClose: () => void;
  handleAddItem: (data: InventarioData & { colaborador: string; turno: string; fecha: string }) => void;
  colaborador: string;
  turno: string;
  fecha: string;
}

const InventarioModalTailwind: React.FC<InventarioModalProps> = ({
  show,
  handleClose,
  handleAddItem,
  colaborador,
  turno,
  fecha
}) => {
  const [formData, setFormData] = useState<InventarioData>({
    AGUARDIENTE: 0,
    RON: 0,
    POKER: 0,
    ENERGIZANTE: 0,
    JUGOS_HIT: 0,
    AGUA: 0,
    GASEOSA: 0,
    PAPEL_HIGIENICO: 0,
    ALKA_SELTZER: 0,
    SHAMPOO: 0,
    TOALLA_HIGIENICA: 0,
    CONDONES: 0,
    BONOS: 0
  });

  if (!show) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleSubmit = () => {
    const data = { ...formData, colaborador, turno, fecha };
    handleAddItem(data);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Inventario del Turno
        </h2>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {key.replace(/_/g, ' ')}
              </label>
              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min={0}
              />
            </div>
          ))}
        </form>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventarioModalTailwind;