// reserva.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly repo: Repository<Reserva>
  ) {}

  async findAll(): Promise<Reserva[]> {
    return this.repo.find();
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.repo.findOne({ where: { id } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada');
    return reserva;
  }

  async create(reserva: Reserva): Promise<Reserva> {
    return this.repo.save(reserva);
  }

  async update(id: number, reserva: Reserva): Promise<Reserva> {
    await this.repo.update(id, reserva);
    return this.findOne(id);
  }

  async deleteById(id: number) {
    return this.repo.delete(id);
  }

  async resetAll() {
    await this.repo.delete({});
    return { message: 'Todas las reservas han sido eliminadas.' };
  }
}