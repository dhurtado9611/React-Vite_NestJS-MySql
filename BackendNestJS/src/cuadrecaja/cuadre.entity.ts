// cuadre.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('cuadre') // el nombre entre comillas debe coincidir con el nombre de la tabla en la BD
export class Cuadre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  colaborador: string;

  @Column()
  fecha: string;

  @Column('int')
  basecaja: number;
}