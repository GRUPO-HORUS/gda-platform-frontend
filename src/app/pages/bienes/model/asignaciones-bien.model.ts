import { UserModel } from "../../../modules/auth/_models/user.model";
import { UnidadModel } from "./unidad.model";

export class AsignacionesBienModel {
  id: number;
  tipoAsignacion: string;
  estado: string;
  usuario: UserModel;
  
  /*setBien(bien: any) {
    this.id = bien.id;
    this.rotulado = bien.rotulado || '';
    this.detalle = bien.detalle || '';
    this.fechaIncorporacion = bien.fechaIncorporacion || new Date();
    this.valorIncorporacion = bien.valorIncorporacion || 0;
    this.gdaCategoriaBienId = bien.gdaCategoriaBienId;
    this.gdaUnidadUbicacionId = bien.gdaUnidadUbicacionId || null;
  }*/
}
