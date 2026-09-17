import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly allowedColumns: Record<string, string[]> = {
    users: ['username', 'password', 'rol'],
  };

  // Columnas que nunca deben salir del backend, aunque estén permitidas para escritura.
  private readonly sensitiveColumns: Record<string, string[]> = {
    users: ['password'],
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

  private selectableColumns(table: string): string {
    const sensitive = this.sensitiveColumns[table] ?? [];
    if (sensitive.length === 0) {
      return '*';
    }
    return this.allowedColumns[table]
      .concat('id')
      .filter((col) => !sensitive.includes(col))
      .join(', ');
  }

  private async hashSensitiveFields(table: string, data: any): Promise<any> {
    if (table === 'users' && typeof data.password === 'string' && data.password.length > 0) {
      return { ...data, password: await bcrypt.hash(data.password, 10) };
    }
    return data;
  }

  async findAll(table: string) {
    this.validateTable(table);
    return await this.dataSource.query(`SELECT ${this.selectableColumns(table)} FROM ${table}`);
  }

  async findOne(table: string, id: number) {
    this.validateTable(table);
    const rows = await this.dataSource.query(
      `SELECT ${this.selectableColumns(table)} FROM ${table} WHERE id = ?`,
      [id],
    );
    return rows[0];
  }

  async create(table: string, data: any) {
    this.validateTable(table);
    const keys = Object.keys(data);
    this.validateColumns(table, keys);
    const safeData = await this.hashSensitiveFields(table, data);
    const values = Object.values(safeData);
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
    const safeData = await this.hashSensitiveFields(table, data);
    const fields = keys.map(key => `${key} = ?`).join(', ');
    const values = Object.values(safeData);
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
