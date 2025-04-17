import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Query,
  } from '@nestjs/common';
  import { ReservasClienteService } from '../cliente/reservas_cliente.service';
  import { CreateReservaClienteDto } from '../cliente/dto/create-reserva-cliente.dto';
  
  @Controller('reservas-cliente')
  export class ReservasClienteController {
    constructor(private readonly reservasService: ReservasClienteService) {}
  
    @Post()
    create(@Body() createReservaDto: CreateReservaClienteDto) {
      return this.reservasService.create(createReservaDto);
    }
  
    @Get()
    findAll() {
      return this.reservasService.findAll();
    }
  
    @Get(':cliente_id')
    findByCliente(@Param('cliente_id') cliente_id: string) {
      return this.reservasService.findByCliente(cliente_id);
    }
  
    @Get('/fecha/:fecha')
    findByFecha(@Param('fecha') fecha: string) {
      return this.reservasService.findByFecha(fecha);
    }
  }  