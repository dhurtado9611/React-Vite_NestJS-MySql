// cuadre.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cuadre } from './cuadre.entity';
import { CreateCuadreDto } from './dto/create-cuadre.dto';
import { UpdateCuadreDto } from './dto/update-cuadre.dto';

@Injectable()
export class CuadreService {
  private readonly logger = new Logger(CuadreService.name);

  constructor(
    @InjectRepository(Cuadre)
    private readonly cuadreRepository: Repository<Cuadre>,
  ) {}

  async findAll(): Promise<Cuadre[]> {
    return this.cuadreRepository.find();
  }

  async create(cuadre: CreateCuadreDto): Promise<Cuadre> {
    return this.cuadreRepository.save(cuadre);
  }

  async update(id: number, cuadre: UpdateCuadreDto): Promise<Cuadre> {
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
      this.logger.log('Ejecutando resetearTodo()');
      await this.cuadreRepository.manager.transaction(async (manager) => {
        await manager.clear(Cuadre);
        await manager.query('ALTER TABLE cuadre AUTO_INCREMENT = 1');
      });
      this.logger.log('Registros eliminados y AUTO_INCREMENT reiniciado');
    } catch (error) {
      this.logger.error('Error en resetearTodo():', error.message);
      throw new Error('Falló el reseteo de cuadre');
    }
  }
}