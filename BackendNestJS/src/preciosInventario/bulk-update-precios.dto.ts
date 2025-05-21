export class BulkUpdatePreciosDto {
    productos: {
      nombre: string;
      precio: number;
      imagen?: string;
    }[];
  }  