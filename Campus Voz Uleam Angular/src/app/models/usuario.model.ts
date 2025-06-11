export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  fechaRegistro: Date;
}

export enum RolUsuario {
  ESTUDIANTE = 'estudiante',
  PROFESOR = 'profesor',
  AUTORIDAD = 'autoridad'
}