import { useState, ChangeEvent } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

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

const InventarioModal: React.FC<InventarioModalProps> = ({
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseInt(value) || 0 });
  };

  const handleSubmit = () => {
    const dataCompleta = {
      ...formData,
      colaborador,
      turno,
      fecha
    };
    handleAddItem(dataCompleta);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Inventario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {Object.keys(formData).map((item, index) => (
            <Form.Group className="mb-3" key={index}>
              <Form.Label>{item.replace(/_/g, ' ')}</Form.Label>
              <Form.Control
                type="number"
                name={item}
                value={formData[item as keyof InventarioData]}
                onChange={handleChange}
                min={0}
              />
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InventarioModal;