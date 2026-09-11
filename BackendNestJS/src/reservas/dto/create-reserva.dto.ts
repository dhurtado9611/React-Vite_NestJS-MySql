import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateReservaDto {
  @IsOptional()
  @IsString()
  vehiculo?: string;

  @IsOptional()
  @IsString()
  placa?: string;

  @IsNumber()
  @IsPositive()
  habitacion: number;

  @IsNumber()
  @IsPositive()
  valor: number;

  @IsString()
  @IsNotEmpty()
  hentrada: string;

  @IsOptional()
  @IsString()
  hsalida?: string;

  @IsOptional()
  @IsString()
  hsalidamax?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  fecha?: string;

  @IsString()
  @IsNotEmpty()
  colaborador: string;
}
