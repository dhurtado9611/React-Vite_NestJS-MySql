import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot(): string {
    return 'API BackendNestJS funcionando correctamente 🚀';
  }
}