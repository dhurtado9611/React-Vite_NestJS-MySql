import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreciosInventario } from './precios-inventario.entity';
import { BulkUpdatePreciosDto } from './bulk-update-precios.dto';

@Injectable()
export class PreciosInventarioService {
  constructor(
    @InjectRepository(PreciosInventario)
    private readonly repo: Repository<PreciosInventario>,
  ) {}

  async bulkUpdate({ productos }: BulkUpdatePreciosDto) {
    for (const prod of productos) {
      const existente = await this.repo.findOne({ where: { nombre: prod.nombre } });
      if (existente) {
        existente.precio = prod.precio;
        existente.imagen = prod.imagen ?? '';
        await this.repo.save(existente);
      } else {
        const nuevo = this.repo.create(prod);
        await this.repo.save(nuevo);
      }
    }
    return { message: 'Precios actualizados correctamente' };
  }

  async findAll() {
    return this.repo.find();
  }
}