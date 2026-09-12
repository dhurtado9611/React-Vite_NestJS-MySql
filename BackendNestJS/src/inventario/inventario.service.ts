// inventario.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
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
      console.log('📌 Ejecutando resetearTodo() inventario');
      await this.inventarioRepository.clear();
      await this.inventarioRepository.query('ALTER TABLE inventario AUTO_INCREMENT = 1');
      console.log('✅ Inventario eliminado y reiniciado');
    } catch (error) {
      console.error('Error en resetearTodo() inventario:', error);
      throw new Error('Falló el reseteo de inventario');
    }
  }

  // ✅ ESTA ES LA FUNCIÓN NUEVA QUE CORRIGE EL ERROR
  async descontarStock(items: { nombre: string; cantidad: number }[]): Promise<Inventario> {
    // 1. Buscamos el último inventario registrado (asumiendo que es el turno actual)
    const inventarios = await this.inventarioRepository.find({
      order: { id: 'DESC' },
      take: 1,
    });

    if (!inventarios || inventarios.length === 0) {
      throw new Error('No hay inventario activo para descontar. Crea uno primero.');
    }

    const inventarioActual = inventarios[0];

    // 2. Iterar sobre los productos vendidos y restar
    items.forEach(item => {
      const nombreProducto = item.nombre; 
      
      // Verificamos si la columna existe en la entidad (ej: "AGUARDIENTE")
      // TypeScript podría quejarse si no es indexable, por eso validamos undefined
      if ((inventarioActual as any)[nombreProducto] !== undefined) {
        const stockActual = Number((inventarioActual as any)[nombreProducto]);
        const cantidadARestar = Number(item.cantidad);

        // Restamos el stock
        (inventarioActual as any)[nombreProducto] = stockActual - cantidadARestar;
      }
    });

    // 3. Guardar los cambios en la base de datos
    return this.inventarioRepository.save(inventarioActual);
  }
}