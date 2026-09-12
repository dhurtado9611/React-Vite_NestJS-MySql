import { PartialType } from '@nestjs/mapped-types';
import { CreatePrecioInventarioDto } from './create-precio-inventario.dto';

export class UpdatePrecioInventarioDto extends PartialType(CreatePrecioInventarioDto) {}
