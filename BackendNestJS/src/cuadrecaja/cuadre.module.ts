import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cuadre } from './cuadre.entity';
import { CuadreService } from './cuadre.service';
import { CuadreController } from './cuadre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([cuadre])],
  providers: [CuadreService],
  controllers: [CuadreController],
})
export class CuadreModule {}