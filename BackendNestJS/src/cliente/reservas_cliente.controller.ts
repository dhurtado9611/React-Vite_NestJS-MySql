import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ReservasClienteService } from '../cliente/reservas_cliente.service';
  import { CreateReservaClienteDto } from '../cliente/dto/create-reserva-cliente.dto';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';

  @Controller('reservas-cliente')
  export class ReservasClienteController {
    constructor(private readonly reservasService: ReservasClienteService) {}

    // Pública a propósito: es el formulario de reserva que llena el huésped
    // sin sesión iniciada.
    @Post()
    create(@Body() createReservaDto: CreateReservaClienteDto) {
      return this.reservasService.create(createReservaDto);
    }

    // A partir de acá se expone PII de clientes (nombre, correo, teléfono):
    // requiere sesión iniciada.
    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
      return this.reservasService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':cliente_id')
    findByCliente(@Param('cliente_id') cliente_id: string) {
      return this.reservasService.findByCliente(cliente_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/fecha/:fecha')
    findByFecha(@Param('fecha') fecha: string) {
      return this.reservasService.findByFecha(fecha);
    }
  }