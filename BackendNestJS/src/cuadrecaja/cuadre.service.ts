// cuadre.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuadre } from './cuadre.entity';

@Injectable()
export class CuadreService {
  constructor(
    @InjectRepository(Cuadre)
    private readonly cuadreRepository: Repository<Cuadre>,
  ) {}

  async findAll(): Promise<Cuadre[]> {
    return this.cuadreRepository.find();
  }

  async create(cuadre: Cuadre): Promise<Cuadre> {
    return this.cuadreRepository.save(cuadre);
  }

  async update(id: number, cuadre: Cuadre): Promise<Cuadre> {
    await this.cuadreRepository.update(id, cuadre);
    const updatedCuadre = await this.cuadreRepository.findOneBy({ id });
    if (!updatedCuadre) {
      throw new Error(`Cuadre with id ${id} not found`);
    }
    return updatedCuadre;
  }

  async remove(id: number): Promise<void> {
    await this.cuadreRepository.delete(id);
  }

  async resetearTodo(): Promise<void> {
    try {
      console.log('Entrando a resetearTodo()');
      await this.cuadreRepository.clear();
      await this.cuadreRepository.query('ALTER TABLE cuadre AUTO_INCREMENT = 1');
      console.log('Cuadre eliminado y AUTO_INCREMENT reiniciado');
    } catch (error) {
      console.error('Error en resetearTodo():', error);
      throw new Error('Falló el reseteo de cuadre');
    }
  }
}
