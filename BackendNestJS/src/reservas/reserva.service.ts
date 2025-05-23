// reserva.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>
  ) {}

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find();
  }

  async create(reserva: Reserva): Promise<Reserva> {
    return this.reservaRepository.save(reserva);
  }

  async update(id: number, reserva: Reserva): Promise<Reserva> {
    await this.reservaRepository.update(id, reserva);
    const updated = await this.reservaRepository.findOne({ where: { id } });
    if (!updated) throw new NotFoundException('Reserva no encontrada');
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.reservaRepository.delete(id);
  }

  async resetearTodas(): Promise<void> {
    await this.reservaRepository.createQueryBuilder()
      .delete()
      .from(Reserva)
      .execute();
  }
}