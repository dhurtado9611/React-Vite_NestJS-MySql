import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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