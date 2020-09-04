import { UserModel } from "../modules/auth/_models/user.model";

export class UsuariosTabla {
  content: UserModel[];
  empty: boolean;
  totalElements: number;
  
  /*setUsuariosTabla(error: any) {
    this.message = error.message || '';
    this.formatted = error.formatted; 
  }*/
}
