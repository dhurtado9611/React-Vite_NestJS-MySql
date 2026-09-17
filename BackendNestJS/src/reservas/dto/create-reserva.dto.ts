import { IsString, IsNotEmpty, IsNumber, IsPositive, IsOptional, IsIn } from 'class-validator';
import { Transform, Type } from 'class-transformer';

// @IsOptional() solo se salta la validación si el valor es undefined/null:
// un string vacío ("") sigue evaluándose contra @IsIn y falla. El frontend
// manda "" cuando el campo no aplica (ej. pago en efectivo), así que lo
// normalizamos a undefined antes de validar.
const emptyToUndefined = ({ value }: { value: unknown }) => (value === '' ? undefined : value);

export class CreateReservaDto {
  @IsOptional()
  @IsString()
  vehiculo?: string;

  @IsOptional()
  @IsString()
  placa?: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  habitacion: number;

  @Type(() => Number)
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

  @Transform(emptyToUndefined)
  @IsOptional()
  @IsIn(['efectivo', 'transferencia'])
  metodoPago?: string;

  @Transform(emptyToUndefined)
  @IsOptional()
  @IsIn(['Nequi', 'Daviplata', 'Bancolombia', 'Bre-B'])
  bancoTransferencia?: string;

  @IsOptional()
  @IsString()
  referenciaTransferencia?: string;
}
