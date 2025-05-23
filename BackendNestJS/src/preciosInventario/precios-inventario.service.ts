// precios-inventario.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreciosInventario } from './precios-inventario.entity';
import { UpdatePrecioInventarioDto } from './dto/update-precio-inventario.dto';

@Injectable()
export class PreciosInventarioService {
  constructor(
    @InjectRepository(PreciosInventario)
    private readonly repo: Repository<PreciosInventario>,
  ) {}

  findAll(): Promise<PreciosInventario[]> {
    return this.repo.find();
  }

  async update(id: number, dto: UpdatePrecioInventarioDto) {
    await this.repo.update(id, dto);
    return { message: 'Precio actualizado correctamente' };
  }
}