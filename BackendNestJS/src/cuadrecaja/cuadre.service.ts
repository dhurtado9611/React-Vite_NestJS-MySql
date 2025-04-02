import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}