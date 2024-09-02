export interface Empleado {
  id: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  role?: string;
  identification: string;
  sex: boolean;
  address: string;
  birthday: string;
  phone: string;
  codeEmployee?: string;
  created?: string;
  updated?: string;
  status: boolean;
}
