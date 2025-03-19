import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Datos del usuario (solo para prueba, esto debe venir de la base de datos en producción)
  private readonly user = {
    id: 1,
    email: 'admin@example.com',
    password: '$2b$10$MhnNQNTVlq9mO5kMdne0zeiWR25sleT3edLif1zISi4NgKNIWieNm', // contraseña hasheada
  };

  // Validar usuario (compara email y contraseña)
  async validateUser(email: string, password: string): Promise<any> {
    console.log('Password recibido:', password);
    console.log('Password almacenado:', this.user.password);

    const isPasswordMatch = bcrypt.compareSync(password, this.user.password);
    console.log('Comparación:', isPasswordMatch);

    if (email === this.user.email && isPasswordMatch) {
      const { password, ...result } = this.user;
      return result;
    }
    throw new UnauthorizedException('Correo o contraseña incorrecta');
  }

  // Generar token JWT
  async login(user: any) {
    try {
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      console.log('Token generado:', token);

      return {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Error al generar el token:', error);
      throw new UnauthorizedException('Error al generar el token');
    }
  }
}
