export interface IUsuarioActualizar {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role?: string;
  status?: number;
  identification?: string;
  sex?: number;
  address?: string;
  birthday?: string;
  phone?: string;
  codeEmployee?: string;
  created?: string;
  updated?: string;
}

export interface IUsuario {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  role: string;
  status?: number;
  created?: string;
  updated?: string;
}

export interface IUsuarioLogin {
  email: string;
  password: string;
}
