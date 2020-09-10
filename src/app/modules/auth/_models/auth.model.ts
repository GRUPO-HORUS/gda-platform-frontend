import { UnidadModel } from "../../../pages/ubicacion/model/unidad.model";

export class AuthModel {
  /*accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  setAuth(auth: any) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }*/

  access_token: string;
  refresh_token: string;
  expires_in: Date;
  token_type: string;

  idUsuario: number;
  nombreUsuario: String;
  nombre: String;
  apellidos: String;
  correo: string;
  unidad: UnidadModel;
  entidad: string;

  setAuth(auth: any) {
    this.access_token = auth.accessToken;
    this.refresh_token = auth.refreshToken;
    this.expires_in = auth.expiresIn;
    this.token_type = auth.tokenType;
  }
}
