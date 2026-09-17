import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('reservas_cliente')
export class ReservasCliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  cliente_id: string;

  @Column()
  nombre_cliente: string;

  @Column()
  correo_cliente: string;

  @Column()
  telefono_cliente: string;

  @Column()
  habitacion: string;

  @Column()
  tipo_habitacion: string;

  @Index()
  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_entrada: string;

  @Column({ type: 'time' })
  hora_salida: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ type: 'enum', enum: ['pendiente', 'confirmada', 'cancelada'], default: 'pendiente' })
  estado: string;

  @Column({ default: false })
  confirmado_por_admin: boolean;

  @CreateDateColumn()
  created_at: Date;
}