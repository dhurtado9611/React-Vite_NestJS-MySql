import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

class LoginDto {
  email!: string;
  password!: string;
}

@Controller('auth') // Ruta base: /auth
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login') // Ruta específica: /auth/login
  async login(@Body() body: LoginDto) {
    try {
      const user = await this.authService.validateUser(body.email, body.password);
      if (!user) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      // 🔥 Devolver datos adicionales (email, id) y el token
      const result = await this.authService.login(user);
      return {
        access_token: result.access_token,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('Error al autenticar:', error.message);
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }
}
