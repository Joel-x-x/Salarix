export interface IPlanSalarial {
  id?: number;
  position_id: number;
  baseSalary: number;
  description: string;
  checkin: string;
  checkout: string;
  esc: boolean;
  esc_included: boolean;
  cp_included: boolean;
  app_included: boolean;
  dts_included: boolean;
  dcs_included: boolean;
  frp_included: boolean;
  apep_included: boolean;
  user_id: number;
}
