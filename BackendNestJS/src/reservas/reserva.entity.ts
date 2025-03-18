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

  @Column({ nullable: true })
  observaciones: string;

  @Column()
  hentrada: string;

  @Column({ nullable: true })
  hsalidamax: string;

  @Column({ nullable: true })
  hsalida: string;
}
