export interface IRegistro {
  id?: number;
  start: string;  // Formato 'YYYY-MM-DD HH:MM:SS'
  finish?: string; // Formato 'YYYY-MM-DD HH:MM:SS'
  ordinary_time?: number;
  overtime?: number;
  night_overtime?: number;
}
