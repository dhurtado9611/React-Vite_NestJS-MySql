// inventario.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find();
  }

  async create(inventario: Inventario): Promise<Inventario> {
    return this.inventarioRepository.save(inventario);
  }

  async update(id: number, inventario: Inventario): Promise<Inventario> {
    await this.inventarioRepository.update(id, inventario);
    const updated = await this.inventarioRepository.findOneBy({ id });
    if (!updated) {
      throw new Error(`Inventario con ID ${id} no encontrado`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.inventarioRepository.delete(id);
  }

  async resetearTodo(): Promise<void> {
    try {
      console.log('📌 Ejecutando resetearTodo() inventario');
      await this.inventarioRepository.clear();
      await this.inventarioRepository.query('ALTER TABLE inventario AUTO_INCREMENT = 1');
      console.log('✅ Inventario eliminado y reiniciado');
    } catch (error) {
      console.error('Error en resetearTodo() inventario:', error);
      throw new Error('Falló el reseteo de inventario');
    }
  }
}