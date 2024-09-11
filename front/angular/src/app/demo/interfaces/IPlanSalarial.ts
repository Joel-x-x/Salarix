export interface IPlanSalarial {
  id?: string;
  position_id: string;
  baseSalary?: string;
  description: string;
  checkin: string;
  checkout: string;
  esc_included: number;
  cp_included: number;
  app_included: number;
  dts_included: number;
  dcs_included: number;
  frp_included: number;
  apep_included: number;
  user_id: string;
}
