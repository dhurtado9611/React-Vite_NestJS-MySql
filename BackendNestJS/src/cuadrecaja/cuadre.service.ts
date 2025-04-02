import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { cuadre } from './cuadre.entity';

@Injectable()
export class CuadreService {
  constructor(
    @InjectRepository(cuadre)
    private cuadreRepository: Repository<cuadre>,
  ) {}

  findAll(): Promise<cuadre[]> {
    return this.cuadreRepository.find();
  }
}