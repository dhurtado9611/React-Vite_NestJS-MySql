import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cuadre } from './cuadre.entity';
import { CuadreService } from './cuadre.service';
import { CuadreController } from './cuadre.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Cuadre])],
  controllers: [CuadreController],
  providers: [CuadreService],
})
export class CuadreModule {}
