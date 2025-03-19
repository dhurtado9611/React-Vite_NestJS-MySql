import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vehiculo: string;

  @Column({ nullable: true })
  placa: string;

  @Column()
  habitacion: number;

  @Column()
  valor: number;

  @Column()
  hentrada: string;

  @Column({ nullable: true })
  hsalida: string;

  @Column({ nullable: true })
  hsalidamax: string;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ nullable: true })
  fecha: string;
}
