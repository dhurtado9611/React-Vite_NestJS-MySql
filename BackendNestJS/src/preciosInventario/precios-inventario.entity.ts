import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Asegúrate de mantener el nombre de la tabla si lo agregaste antes, si no, déjalo @Entity()
@Entity('preciosInventario') 
export class PreciosInventario {
  @PrimaryGeneratedColumn()
  id: number;

  // CORRECCIÓN: Quitamos { unique: true } para evitar el crash por nombres vacíos duplicados
  @Column() 
  nombre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'text', nullable: true })
  imagen: string;

  @CreateDateColumn()
  fecha_actualizacion: Date;
}