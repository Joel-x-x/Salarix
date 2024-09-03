export interface IPlanSalarial {
  id: string;
  position_id: string;
  baseSalary: number;
  description: string;
  checkin: string;
  checkout: string;
  esc: number;
  esc_included: number;
  cp_included: number;
  app_included: number;
  dts_included: number;
  dcs_included: number;
  frp_included: number;
  apep_included: number;
  user_id: string;
}
