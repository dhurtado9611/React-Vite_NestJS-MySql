import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private reservaRepository: Repository<Reserva>,
  ) {}

  async create(reserva: Partial<Reserva>) {
    return this.reservaRepository.save(reserva);
  }

  async findAll() {
    return this.reservaRepository.find();
  }

  async findOne(id: number) {
    return this.reservaRepository.findOne({ where: { id } });
  }

  async update(id: number, reserva: Partial<Reserva>) {
    await this.reservaRepository.update(id, reserva);
    return this.reservaRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    await this.reservaRepository.delete(id);
    return { deleted: true };
  }
}