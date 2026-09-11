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

}