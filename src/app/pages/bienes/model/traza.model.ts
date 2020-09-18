import { CategoriaModel } from "./categoria.model";
import { TipoBienModel } from "./tipo-bien.model";
import { UnidadModel } from "./unidad.model";
import { BienModel } from "./bien.model";

export class TrazaModel {
  id: number;
  detalle: string;
  fechaEvento: Date;
  gdaBienId: BienModel;
  
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
