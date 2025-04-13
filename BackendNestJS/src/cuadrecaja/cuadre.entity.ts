import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Cuadre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colaborador: string;

  @Column()
  fecha: string;

  @Column()
  turno: string;

  @Column({ type: 'float' })
  basecaja: number;

  @Column({ type: 'varchar', nullable: true })
  turnoCerrado: string | null;
}
