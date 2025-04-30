// reserva.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from './reserva.entity';

@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
  ) {}

  async findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find();
  }

  async create(reserva: Reserva): Promise<Reserva> {
    return this.reservaRepository.save(reserva);
  }

  async update(id: number, reserva: Reserva): Promise<Reserva> {
    await this.reservaRepository.update(id, reserva);
    const updatedReserva = await this.reservaRepository.findOneBy({ id });
    if (!updatedReserva) {
      throw new Error(`Reserva with id ${id} not found`);
    }
    return updatedReserva;
  }

  async remove(id: number): Promise<void> {
    await this.reservaRepository.delete(id);
  }

  async resetearTodas(): Promise<void> {
    await this.reservaRepository.query('DELETE FROM reservas');
    await this.reservaRepository.query('ALTER TABLE reservas AUTO_INCREMENT = 1');
    console.log('Todas las reservas han sido eliminadas y el contador de IDs reiniciado.');
  }
}
