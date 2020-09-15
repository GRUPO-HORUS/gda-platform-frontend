import { CategoriaModel } from "./categoria.model";
import { TipoBienModel } from "./tipo-bien.model";
import { UnidadModel } from "./unidad.model";

export class BienContableModel {
  id: number;
  anno: number;
  valorRevaluo: number;
  valorDepreciacion: number;
  valorNetoFiscal: number;
  
  //gdaBienTipo: TipoBienModel; 
  
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
