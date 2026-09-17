import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { User } from './user.entity';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$/;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User | null = await this.usersService.findOne(username);
    if (!user) {
      return null;
    }

    const isHashed = BCRYPT_HASH_PATTERN.test(user.password);
    const isValid = isHashed
      ? await bcrypt.compare(password, user.password)
      : user.password === password;

    if (!isValid) {
      return null;
    }

    // Migración transparente: contraseñas heredadas en texto plano se
    // hashean en cuanto el usuario hace login correctamente, sin
    // interrumpir su sesión ni requerir un reseteo manual.
    if (!isHashed) {
      const hashed = await bcrypt.hash(password, 10);
      await this.usersService.updatePassword(user.id, hashed);
    }

    const { password: _password, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      username: user.username,
      sub: user.id,
      rol: user.rol,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };    
  }  
}