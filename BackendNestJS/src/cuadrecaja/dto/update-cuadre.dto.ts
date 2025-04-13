import { PartialType } from '@nestjs/mapped-types';
import { CreateCuadreDto } from './create-cuadre.dto';

export class UpdateCuadreDto extends PartialType(CreateCuadreDto) {}