// src/app/interfaces/IDependiente.ts

export interface IDependiente {
  id: string;
  name: string;
  lastname: string;
  relation: string;
  disability: boolean;
  birthday: string; // o Date si prefieres trabajar con objetos Date
  status: boolean;
  id_user: number;
}
