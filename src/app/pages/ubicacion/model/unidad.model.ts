import { EntidadModel } from "./entidad.model";

export class UnidadModel {
  //id: number;
  id: string;
  nombre: string;
  entidad: EntidadModel;

  unidades_hijas: any[];

  /*codigo: string;
  fechaCreacion: Date;
  fechaModificacion: Date;*/
}
