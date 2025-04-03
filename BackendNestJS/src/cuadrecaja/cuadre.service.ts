import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuadre } from './cuadre.entity';
import { NotFoundException } from '@nestjs/common';


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