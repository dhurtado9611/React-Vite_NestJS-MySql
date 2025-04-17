import {
    IsString,
    IsEmail,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsDateString,
    IsPhoneNumber,
    IsBoolean,
    IsNumber,
  } from 'class-validator';
  
  export class CreateReservaClienteDto {
    @IsString()
    @IsNotEmpty()
    cliente_id: string;
  
    @IsString()
    @IsNotEmpty()
    nombre_cliente: string;
  
    @IsEmail()
    correo_cliente: string;
  
    @IsString()
    @IsPhoneNumber(undefined)
    telefono_cliente: string;
  
    @IsString()
    habitacion: string;
  
    @IsString()
    tipo_habitacion: string;
  
    @IsDateString()
    fecha: string;
  
    @IsString()
    hora_entrada: string;
  
    @IsString()
    hora_salida: string;
  
    @IsNumber()
    precio: number;
  
    @IsOptional()
    @IsString()
    notas?: string;
  
    @IsOptional()
    @IsEnum(['pendiente', 'confirmada', 'cancelada'])
    estado?: string;
  
    @IsOptional()
    @IsBoolean()
    confirmado_por_admin?: boolean;
  }  