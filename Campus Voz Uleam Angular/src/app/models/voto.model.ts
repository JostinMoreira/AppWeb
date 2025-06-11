export interface Voto {
  id?: string;
  publicacionId: string;
  usuarioId: string;
  tipoVoto: TipoVoto;
  fecha: Date;
}

export enum TipoVoto {
  POSITIVO = 'positivo',
  NEGATIVO = 'negativo'
}