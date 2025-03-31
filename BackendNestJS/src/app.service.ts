import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    console.log('Backend funcionando - se accedió a la ruta "/"');
    return 'API BackendNestJS funcionando correctamente 🚀';
  }
}