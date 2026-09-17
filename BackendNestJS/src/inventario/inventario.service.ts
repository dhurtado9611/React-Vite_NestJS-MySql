// inventario.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  private readonly logger = new Logger(InventarioService.name);

  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find();
  }

  async create(inventario: CreateInventarioDto): Promise<Inventario> {
    return this.inventarioRepository.save(inventario);
  }

  async update(id: number, inventario: UpdateInventarioDto): Promise<Inventario> {
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
      this.logger.log('Ejecutando resetearTodo() inventario');
      await this.inventarioRepository.manager.transaction(async (manager) => {
        await manager.clear(Inventario);
        await manager.query('ALTER TABLE inventario AUTO_INCREMENT = 1');
      });
      this.logger.log('Inventario eliminado y reiniciado');
    } catch (error) {
      this.logger.error('Error en resetearTodo() inventario:', error);
      throw new Error('Falló el reseteo de inventario');
    }
  }

  // Descuenta stock dentro de una transacción con bloqueo pesimista para
  // evitar "lost updates" cuando dos ventas concurrentes leen el mismo
  // registro de inventario y sobreescriben el resultado de la otra.
  async descontarStock(items: { nombre: string; cantidad: number }[]): Promise<Inventario> {
    return this.inventarioRepository.manager.transaction(async (manager) => {
      const inventarioActual = await manager
        .createQueryBuilder(Inventario, 'inventario')
        .orderBy('inventario.id', 'DESC')
        .setLock('pessimistic_write')
        .getOne();

      if (!inventarioActual) {
        throw new Error('No hay inventario activo para descontar. Crea uno primero.');
      }

      for (const item of items) {
        const nombreProducto = item.nombre;

        if ((inventarioActual as any)[nombreProducto] !== undefined) {
          const stockActual = Number((inventarioActual as any)[nombreProducto]);
          const cantidadARestar = Number(item.cantidad);
          (inventarioActual as any)[nombreProducto] = stockActual - cantidadARestar;
        }
      }

      return manager.save(inventarioActual);
    });
  }
}