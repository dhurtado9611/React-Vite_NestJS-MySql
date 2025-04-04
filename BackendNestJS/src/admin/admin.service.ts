import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminService {
  private readonly allowedTables = ['cuadre', 'reservas', 'users'];

  constructor(private dataSource: DataSource) {}

  private validateTable(table: string) {
    if (!this.allowedTables.includes(table)) {
      throw new NotFoundException(`La tabla ${table} no está permitida`);
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
    const keys = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    return await this.dataSource.query(
      `INSERT INTO ${table} (${keys}) VALUES (${placeholders})`,
      values,
    );
  }

  async update(table: string, id: number, data: any) {
    this.validateTable(table);
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
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
