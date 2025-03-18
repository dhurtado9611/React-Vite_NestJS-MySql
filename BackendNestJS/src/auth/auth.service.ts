import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private readonly user = {
    id: 1,
    email: 'admin@example.com',
    password:'$2b$10$MhnNQNTVlq9mO5kMdne0zeiWR25sleT3edLif1zISi4NgKNIWieNm',
  };

  async validateUser(email: string, password: string): Promise<any> {
    console.log('Password recibido:', password);
    console.log('Password almacenado:', this.user.password);
    console.log('Comparación:', await bcrypt.compareSync(password, this.user.password));

    if (email === this.user.email && await bcrypt.compareSync(password, this.user.password)) {
      const { password, ...result } = this.user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
  
    console.log('Token generado:', token); // 🔥 Verifica que el token esté generándose
  
    return {
      access_token: token,
    };
  }
}