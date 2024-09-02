// src/app/interfaces/IDetalleNomina.ts

export interface IDetalleNomina {
  id?: number;
  name: string;
  detail: string;
  type: string;
  monto: number;
  isBonus: boolean;
  nomina_id: number;
}
