import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuadre } from './entities/cuadre.entity';
import { CreateCuadreDto } from './dto/create-cuadre.dto';

@Injectable()
export class CuadreService {
  constructor(
    @InjectRepository(Cuadre)
    private readonly cuadreRepository: Repository<Cuadre>,
  ) {}

  async create(createCuadreDto: CreateCuadreDto): Promise<Cuadre> {
    const cuadre = this.cuadreRepository.create(createCuadreDto);
    return this.cuadreRepository.save(cuadre);
  }

  async findAll(): Promise<Cuadre[]> {
    return this.cuadreRepository.find();
  }

  async findOne(id: number): Promise<Cuadre> {
    const cuadre = await this.cuadreRepository.findOne({ where: { id } });
    if (!cuadre) {
      throw new NotFoundException(`No se encontró el cuadre con ID ${id}`);
    }
    return cuadre;
  }

  async update(id: number, updateData: Partial<Cuadre>): Promise<Cuadre> {
    await this.cuadreRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cuadreRepository.delete(id);
  }
}
