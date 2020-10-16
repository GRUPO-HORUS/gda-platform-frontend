import { CategoriaModel } from "./categoria.model";
import { TipoBienModel } from "./tipo-bien.model";
import { UnidadModel } from "./unidad.model";

export class BienModel {
  id: number;
  rotulado: string;
  detalle: string;
  fechaIncorporacion: Date;
  valorIncorporacion: number;
  gdaCategoriaBienId: CategoriaModel;
  gdaUnidadUbicacionId: UnidadModel;
  
  gdaBienTipo: TipoBienModel;
  bienEstado: string;
  bienEstadoConservacion;
  existenciaInventario;
  usuarioResponsableId:string;
  usuarioAsignadoId:string;
  usuarioAprobadorId:string;
  usuarioControlId:string;
  usuarioRegistroId:string;

  atributosDinamicos: any[]=[];
  imagen:string;
  
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
