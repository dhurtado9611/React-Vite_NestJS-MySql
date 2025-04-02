import { Controller, Get } from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { cuadre } from './cuadre.entity';

@Controller('cuadre')
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Get()
  findAll(): Promise<cuadre[]> {
    return this.cuadreService.findAll();
  }
}