import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Corriendo desde el backend de NestJS...';
  }
}
