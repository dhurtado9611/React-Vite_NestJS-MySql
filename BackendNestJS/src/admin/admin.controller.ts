import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // USERS
  @Get('users')
  findAllUsers() {
    return this.adminService.findAll('users');
  }

  @Get('users/:id')
  findOneUser(@Param('id') id: number) {
    return this.adminService.findOne('users', id);
  }

  @Post('users')
  createUser(@Body() data: any) {
    return this.adminService.create('users', data);
  }

  @Put('users/:id')
  updateUser(@Param('id') id: number, @Body() data: any) {
    return this.adminService.update('users', id, data);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: number) {
    return this.adminService.remove('users', id);
  }

  // RESERVAS
  @Get('reservas')
  findAllReservas() {
    return this.adminService.findAll('reservas');
  }

  @Get('reservas/:id')
  findOneReserva(@Param('id') id: number) {
    return this.adminService.findOne('reservas', id);
  }

  @Post('reservas')
  createReserva(@Body() data: any) {
    return this.adminService.create('reservas', data);
  }

  @Put('reservas/:id')
  updateReserva(@Param('id') id: number, @Body() data: any) {
    return this.adminService.update('reservas', id, data);
  }

  @Delete('reservas/:id')
  deleteReserva(@Param('id') id: number) {
    return this.adminService.remove('reservas', id);
  }

  // CUADRE
  @Get('cuadre')
  findAllCuadre() {
    return this.adminService.findAll('cuadre');
  }

  @Get('cuadre/:id')
  findOneCuadre(@Param('id') id: number) {
    return this.adminService.findOne('cuadre', id);
  }

  @Post('cuadre')
  createCuadre(@Body() data: any) {
    return this.adminService.create('cuadre', data);
  }

  @Put('cuadre/:id')
  updateCuadre(@Param('id') id: number, @Body() data: any) {
    return this.adminService.update('cuadre', id, data);
  }

  @Delete('cuadre/:id')
  deleteCuadre(@Param('id') id: number) {
    return this.adminService.remove('cuadre', id);
  }
}