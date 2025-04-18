import { PartialType } from '@nestjs/mapped-types';
import { CreateCuadreDto } from './create-cuadre.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCuadreDto extends PartialType(CreateCuadreDto) {
  @IsOptional()
  @IsNumber()
  totalEntregado?: number;

  @IsOptional()
  @IsNumber()
  totalActual?: number;
}
