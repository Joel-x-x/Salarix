export interface INomina {
  id?: string; // UUID
  periodName: string; // Nombre del período
  detail: string;
  start: string; // Fecha de inicio
  finish: string; // Fecha de fin
  totalGross?: number; // Total bruto
  totalIncome?: number; // Total ingresos
  totalEgress?: number; // Total egresos
  totalLiquid?: number; // Total líquido
  user_id?: string; // ID del usuario asociado
}
