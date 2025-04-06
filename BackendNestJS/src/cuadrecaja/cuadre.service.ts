import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cuadre } from './cuadre.entity';

@Injectable()
export class CuadreService {
  constructor(
    @InjectRepository(Cuadre)
    private cuadreRepository: Repository<Cuadre>,
  ) {}

  findAll(): Promise<Cuadre[]> {
    return this.cuadreRepository.find();
  }

  async create(data: Partial<Cuadre>): Promise<Cuadre> {
    const hoy = new Date().toISOString().split('T')[0];

    const turnoExistente = await this.cuadreRepository.findOne({
      where: {
        fecha: hoy,
        turnoCerrado: IsNull(), // ✅ Usamos IsNull() correctamente
      },
    });

    if (turnoExistente) {
      throw new BadRequestException('Ya existe un turno activo para hoy.');
    }

    const nuevoCuadre = this.cuadreRepository.create(data);
    return await this.cuadreRepository.save(nuevoCuadre);
  }

  async update(id: number, data: Partial<Cuadre>): Promise<Cuadre> {
    await this.cuadreRepository.update(id, data);
    const updated = await this.cuadreRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException(`No se encontró el registro con id ${id}`);
    return updated;
  }
}