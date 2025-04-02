import { Controller, Get } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { Cuadre } from './cuadre.entity';

@Controller('cuadre')
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  findAll(): Promise<Cuadre[]> {
    return this.cuadreService.findAll();
  }
}