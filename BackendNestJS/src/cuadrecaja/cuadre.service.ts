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

  async create(data: Partial<Cuadre>): Promise<Cuadre> {
    const hoy = new Date().toISOString().split('T')[0];

    // Paso 1: Cerrar turno anterior si está abierto
    const turnoAbierto = await this.cuadreRepository.findOne({
      where: {
        fecha: hoy,
        turnoCerrado: IsNull(),
      },
    });

    if (turnoAbierto) {
      const horaCierre = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      await this.cuadreRepository.update(turnoAbierto.id, {
        turnoCerrado: horaCierre,
      });
    }

    // Paso 2: Validar que no se repita el mismo horario
    const mismoTurno = await this.cuadreRepository.findOne({
      where: {
        fecha: hoy,
        turno: data.turno,
      },
    });

    if (mismoTurno) {
      throw new BadRequestException('Ese turno ya fue registrado hoy.');
    }

    // Paso 3: Guardar nuevo turno
    const nuevoCuadre = this.cuadreRepository.create(data);
    return await this.cuadreRepository.save(nuevoCuadre);
  }

  async findAll(): Promise<Cuadre[]> {
    return this.cuadreRepository.find();
  }

  async update(id: number, data: Partial<Cuadre>): Promise<Cuadre> {
    await this.cuadreRepository.update(id, data);
    const updated = await this.cuadreRepository.findOneBy({ id });
    if (!updated) throw new NotFoundException(`No se encontró el registro con id ${id}`);
    return updated;
  }
}