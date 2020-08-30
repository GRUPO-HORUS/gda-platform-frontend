import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {
  id: number;
  email: string;
  nombreusuario: string;
  nombre: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  celular: string;
  credencial: string;

  setUser(user: any) {
    this.id = user.id;
    this.email = user.email || '';
    this.nombreusuario = user.nombreusuario || '';
    this.nombre = user.nombre || '';
    this.apellidos = user.apellidos || '';
    this.cedula = user.cedula || '';
    this.telefono = user.telefono || '';
    this.celular = user.celular || '';
    this.credencial = user.credencial || '';
  }
  /*id: number;
  username: string;
  password: string;
  fullname: string;
  email: string;
  pic: string;
  roles: number[];
  occupation: string;
  companyName: string;
  phone: string;
  address?: AddressModel;
  socialNetworks?: SocialNetworksModel;
  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.fullname = user.fullname || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/users/default.jpg';
    this.roles = user.roles || [];
    this.occupation = user.occupation || '';
    this.companyName = user.companyName || '';
    this.phone = user.phone || '';
    this.address = user.address;
    this.socialNetworks = user.socialNetworks;
  }*/
}
