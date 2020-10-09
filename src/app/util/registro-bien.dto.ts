
export class RegistroBienDTO {
  estadoConservacion;
  detalle: string;
  existenciaInventario;
  tipoBienId: string;
  categoriaBienId: string;
  unidadUbicacionId: string;
  usuarioResponsableId:string;
  usuarioAsignadoId:string;
  usuarioAprobadorId:string;
  usuarioControlId:string;
  usuarioRegistroId:string;
  //fechaIncorporacion: Date;
  valorIncorporacion: number;
  atributosDinamicos: any[]=[];
  
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
