import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  private readonly allowedColumns: Record<string, string[]> = {
    users: ['username', 'password', 'rol'],
  };

  constructor(private dataSource: DataSource) {}

  private validateTable(table: string) {
    if (!this.allowedColumns[table]) {
      throw new NotFoundException(`La tabla ${table} no está permitida`);
    }
  }

  private validateColumns(table: string, keys: string[]) {
    const allowed = this.allowedColumns[table];
    const invalid = keys.filter((key) => !allowed.includes(key));
    if (invalid.length > 0) {
      throw new BadRequestException(`Campos no permitidos para ${table}: ${invalid.join(', ')}`);
    }
  }

  async findAll(table: string) {
    this.validateTable(table);
    return await this.dataSource.query(`SELECT * FROM ${table}`);
  }

  async findOne(table: string, id: number) {
    this.validateTable(table);
    const rows = await this.dataSource.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return rows[0];
  }

  async create(table: string, data: any) {
    this.validateTable(table);
    const keys = Object.keys(data);
    this.validateColumns(table, keys);
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    return await this.dataSource.query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`,
      values,
    );
  }

  async update(table: string, id: number, data: any) {
    this.validateTable(table);
    const keys = Object.keys(data);
    this.validateColumns(table, keys);
    const fields = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    return await this.dataSource.query(
      `UPDATE ${table} SET ${fields} WHERE id = ?`,
      [...values, id],
    );
  }

  async remove(table: string, id: number) {
    this.validateTable(table);
    return await this.dataSource.query(`DELETE FROM ${table} WHERE id = ?`, [id]);
  }
}
