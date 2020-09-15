import { BienContableModel } from "../pages/bienes/model/bien-contable.model";

export class ContablesTabla {
  content: BienContableModel[];
  empty: boolean;
  totalElements: number;
  
  /*setBienesTabla(error: any) {
    this.message = error.message || '';
    this.formatted = error.formatted; 
  }*/
}
