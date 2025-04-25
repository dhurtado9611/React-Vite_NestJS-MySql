import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './create-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepo: Repository<Inventario>,
  ) {}

  create(data: CreateInventarioDto) {
    const nuevo = this.inventarioRepo.create(data);
    return this.inventarioRepo.save(nuevo);
  }

  remove(id: number) {
    return this.inventarioRepo.delete(id);
  }

  async findByTurno(fecha: string, turno: string, colaborador: string) {
    return this.inventarioRepo.findOne({ where: { fecha, turno, colaborador } });
  }
}