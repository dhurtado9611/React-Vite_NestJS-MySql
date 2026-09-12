import { IsString, IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateCuadreDto {
  @IsString()
  @IsNotEmpty()
  colaborador: string;

  @IsDateString()
  fecha: string;

  @IsNumber()
  basecaja: number;

  @IsString()
  @IsNotEmpty()
  turno: string;

  @IsOptional()
  @IsNumber()
  totalEntregado?: number;

  @IsOptional()
  @IsNumber()
  totalActual?: number;

  @IsOptional()
  @IsString()
  turnoCerrado?: string | null;
}
