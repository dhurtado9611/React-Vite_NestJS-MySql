import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreciosInventario } from './precios-inventario.entity';
import { UpdatePrecioInventarioDto } from './dto/update-precio-inventario.dto';
import { CreatePrecioInventarioDto } from './dto/create-precio-inventario.dto';

@Injectable()
export class PreciosInventarioService {
  constructor(
    @InjectRepository(PreciosInventario)
    private readonly repo: Repository<PreciosInventario>,
  ) {}

  findAll(): Promise<PreciosInventario[]> {
    return this.repo.find({
        order: { nombre: 'ASC' } // Ordenar alfabéticamente es mejor para el cliente
    });
  }

  // ESTE MÉTODO FALTABA
  create(dto: CreatePrecioInventarioDto) {
    const nuevo = this.repo.create(dto);
    return this.repo.save(nuevo);
  }

  async update(id: number, dto: UpdatePrecioInventarioDto) {
    await this.repo.update(id, dto);
    return { message: 'Precio actualizado correctamente' };
  }
}