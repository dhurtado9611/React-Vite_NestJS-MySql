import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservasCliente } from './reservas_cliente.entity';
import { CreateReservaClienteDto } from './dto/create-reserva-cliente.dto';

@Injectable()
export class ReservasClienteService {
  constructor(
    @InjectRepository(ReservasCliente)
    private readonly reservasRepo: Repository<ReservasCliente>,
  ) {}

  async create(dto: CreateReservaClienteDto): Promise<ReservasCliente> {
    const reserva = this.reservasRepo.create(dto);
    return await this.reservasRepo.save(reserva);
  }

  async findAll(): Promise<ReservasCliente[]> {
    return await this.reservasRepo.find({
      order: { fecha: 'DESC', hora_entrada: 'ASC' },
    });
  }

  async findByCliente(cliente_id: string): Promise<ReservasCliente[]> {
    return await this.reservasRepo.find({
      where: { cliente_id },
      order: { fecha: 'DESC' },
    });
  }

  async findByFecha(fecha: string): Promise<ReservasCliente[]> {
    return await this.reservasRepo.find({
      where: { fecha },
      order: { hora_entrada: 'ASC' },
    });
  }

  async findHabitacionesOcupadas(fecha: string): Promise<number[]> {
    const reservas = await this.reservasRepo.find({ where: { fecha } });
    return reservas.map((r) => parseInt(r.habitacion));
  }
}