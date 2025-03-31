import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'admin',
      password: '123456', // sin hash, solo para pruebas
    },
  ];

  async findOne(username: string) {
    return this.users.find(user => user.username === username);
  }
}