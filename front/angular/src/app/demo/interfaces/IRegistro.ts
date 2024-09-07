export interface IRegistro {
  id?: string;
  start?: string;  // Formato 'YYYY-MM-DD HH:MM:SS'
  finish?: string; // Formato 'YYYY-MM-DD HH:MM:SS'
  ordinary_time?: number;
  overtime?: number;
  night_overtime?: number;
}
