import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator'

export class CreateCuadreDto {
  @IsString()
  colaborador: string

  @IsDateString()
  fecha: string

  @IsString()
  turno: string

  @IsNumber()
  basecaja: number

  @IsOptional()
  @IsString()
  turnoCerrado?: string | null
}