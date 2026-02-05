// src/precios-inventario/dto/create-precio-inventario.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator'; 
// (Si no usas class-validator, puedes quitar los decoradores, pero es recomendado usarlos)

export class CreatePrecioInventarioDto {
  @IsString()
  nombre: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsString()
  imagen?: string;
}