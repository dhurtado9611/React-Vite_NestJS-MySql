// inventario.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int') AGUARDIENTE: number;
  @Column('int') RON: number;
  @Column('int') POKER: number;
  @Column('int') ENERGIZANTE: number;
  @Column('int') JUGOS_HIT: number;
  @Column('int') AGUA: number;
  @Column('int') GASEOSA: number;
  @Column('int') PAPEL_HIGIENICO: number;
  @Column('int') ALKA_SELTZER: number;
  @Column('int') SHAMPOO: number;
  @Column('int') TOALLA_HIGIENICA: number;
  @Column('int') CONDONES: number;
  @Column('int') BONOS: number;

  @Column() fecha: string;
  @Column() turno: string;
  @Column() colaborador: string;
} 