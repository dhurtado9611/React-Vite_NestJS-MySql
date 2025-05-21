import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { PreciosInventarioService } from './precios-inventario.service';
import { BulkUpdatePreciosDto } from './bulk-update-precios.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('precios-inventario')
@UseGuards(JwtAuthGuard)
export class PreciosInventarioController {
  constructor(private readonly service: PreciosInventarioService) {}

  @Post('bulk-update')
  async bulkUpdate(@Body() body: BulkUpdatePreciosDto) {
    return this.service.bulkUpdate(body);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}