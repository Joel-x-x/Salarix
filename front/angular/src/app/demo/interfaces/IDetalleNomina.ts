export interface IDetalleNomina {
  id: string; // UUID
  name: string; // Nombre del detalle
  detail: string; // Descripción del detalle
  type: number; // Tipo de detalle (0 = Egreso, 1 = Ingreso)
  monto: number; // Monto del detalle
  nomina_id?: string; // ID de la nómina asociada
  created?: Date; // Fecha de creación
  isBonus?: number; // Indica si es un bono (0 = No, 1 = Sí)
}
