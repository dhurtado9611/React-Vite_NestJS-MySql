import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CuadreService } from './cuadre.service';
import { CreateCuadreDto } from './dto/create-cuadre.dto';
import { UpdateCuadreDto } from './dto/update-cuadre.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('cuadre')
@UseGuards(JwtAuthGuard)
export class CuadreController {
  constructor(private readonly cuadreService: CuadreService) {}

  @Post()
  create(@Body() createCuadreDto: CreateCuadreDto) {
    return this.cuadreService.create(createCuadreDto);
  }

  @Get()
  findAll() {
    return this.cuadreService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const cuadre = await this.cuadreService.findOne(+id);
    if (!cuadre) {
      throw new NotFoundException(`Cuadre con ID ${id} no encontrado`);
    }
    return cuadre;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCuadreDto: UpdateCuadreDto) {
    return this.cuadreService.update(+id, updateCuadreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cuadreService.remove(+id);
  }
}
