export interface IReporteNomina {
  id: string;
  periodName: string;
  start: string;
  finish: string;
  detail: string;
  totalProvision: number;
  totalIncome: number;
  totalEgress: number;
  totalLiquid: number;
  firstname: string;
  lastname: string;
}

export interface IReporteRegistro {
  id: string;
  start: string;  // Formato 'YYYY-MM-DD HH:MM:SS'
  finish: string; // Formato 'YYYY-MM-DD HH:MM:SS'
  ordinary_time: number;
  overtime: number;
  night_overtime: number;
  codeEmployee: string;
  firstname: string;
  lastname: string;
}
