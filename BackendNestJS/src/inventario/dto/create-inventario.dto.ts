import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateInventarioDto {
  @IsInt()
  @Min(0)
  AGUARDIENTE: number;

  @IsInt()
  @Min(0)
  RON: number;

  @IsInt()
  @Min(0)
  POKER: number;

  @IsInt()
  @Min(0)
  ENERGIZANTE: number;

  @IsInt()
  @Min(0)
  JUGOS_HIT: number;

  @IsInt()
  @Min(0)
  AGUA: number;

  @IsInt()
  @Min(0)
  GASEOSA: number;

  @IsInt()
  @Min(0)
  PAPEL_HIGIENICO: number;

  @IsInt()
  @Min(0)
  ALKA_SELTZER: number;

  @IsInt()
  @Min(0)
  SHAMPOO: number;

  @IsInt()
  @Min(0)
  TOALLA_HIGIENICA: number;

  @IsInt()
  @Min(0)
  CONDONES: number;

  @IsInt()
  @Min(0)
  BONOS: number;

  @IsString()
  @IsNotEmpty()
  colaborador: string;

  @IsString()
  @IsNotEmpty()
  turno: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;
}
