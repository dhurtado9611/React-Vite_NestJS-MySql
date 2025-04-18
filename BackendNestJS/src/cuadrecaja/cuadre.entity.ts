import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cuadre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colaborador: string;

  @Column()
  fecha: string;

  @Column({ type: 'float' })
  basecaja: number;

  @Column({ type: 'int', nullable: true })
  totalEntregado: number;

  @Column()
  turno: string;

  @Column({ type: 'int', nullable: true })
  totalActual?: number;

  @Column({ type: 'varchar', nullable: true })
  turnoCerrado: string | null;
}
