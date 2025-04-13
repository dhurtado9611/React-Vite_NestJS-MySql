import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuadreService } from './cuadre.service';
import { CuadreController } from './cuadre.controller';
import { Cuadre } from './cuadre.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cuadre])],
  controllers: [CuadreController],
  providers: [CuadreService],
})
export class CuadreModule {}
