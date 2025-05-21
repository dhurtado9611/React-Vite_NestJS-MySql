import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreciosInventario } from './precios-inventario.entity';
import { PreciosInventarioService } from './precios-inventario.service';
import { PreciosInventarioController } from './precios-inventario.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PreciosInventario])],
  providers: [PreciosInventarioService],
  controllers: [PreciosInventarioController],
})
export class PreciosInventarioModule {}