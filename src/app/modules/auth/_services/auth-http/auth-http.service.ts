import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

import { UsersTable } from '../../../../_helpers/fake/fake-db/users.table';
import { RolModel } from '../../_models/rol.model';
import { UsuariosTabla } from '../../../../util/usuarios-tabla';
import { RolesTabla } from '../../../../util/roles-tabla';
import { CategoriasTabla } from '../../../../util/categorias-tabla';
import { SubCategoriasTabla } from '../../../../util/subcategorias-tabla';
import { UserRolDto } from '../../../../util/user-rol.dto';
import { BienesTabla } from '../../../../util/bienes-tabla';
import { TiposTabla } from '../../../../util/tipos-tabla';
import { AtributoValorBienDTO } from '../../../../util/atributo-valor-bien.dto';
import { AtributosBien } from '../../../../util/atributos-bien';
import { UnidadesTabla } from '../../../../util/unidades-tabla';
import { UnidadModel } from '../../../../pages/ubicacion/model/unidad.model';
import { ContablesTabla } from '../../../../util/contables-tabla';
import { TrazaTabla } from '../../../../util/traza-tabla';
import { DashboardDTO } from '../../../../util/dashboard.dto';

//const API_USERS_URL = `${environment.apiUrl}/users`;
const API_USERS_URL = 'http://localhost:8081/api/v1';
//const API_USERS_URL = 'api';

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    
    const body = new HttpParams()
      .set('username', email)
      .set('password', password)
      .set('grant_type', 'password');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa('gdaAngularApp:12345')
      })
    };

    return this.http.post<AuthModel>(API_USERS_URL+'/oauth/token', body, httpOptions);
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL+'/auth/usuarios/registro', user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  // Recupera todos los roles existentes
  getAllRols(token): Observable<RolesTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<RolesTabla>(API_USERS_URL+'/auth/rol', {
      headers: httpHeaders,
    });
  }

  asignRols(token, user:UserRolDto):Observable<any>{
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(API_USERS_URL+'/auth/rol/asignar',user,{
      headers: httpHeaders,
    });
  }

  guardarCoefDepreciacion(token, coefDepreciacion): Observable<any> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(API_USERS_URL+'/bien/datoscontables/coeficiente/'+coefDepreciacion,null,{
      headers: httpHeaders,
    });
  }

  //Recupera todos los usuarios existentes
  getAllUsers(token): Observable<UsuariosTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UsuariosTabla>(API_USERS_URL+'/auth/usuarios', {
      headers: httpHeaders,
    });
  }

  getStatsDashboard(token): Observable<DashboardDTO> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<DashboardDTO>(API_USERS_URL+'/dashboard', {
      headers: httpHeaders,
    });
  }

  getAllBienes(token): Observable<BienesTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<BienesTabla>(API_USERS_URL+'/bien', {
      headers: httpHeaders,
    });
  }

  getDetallesBien(token, idBien): Observable<AtributosBien> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<AtributosBien>(API_USERS_URL+'/bien/detalle/'+idBien, {
      headers: httpHeaders,
    });
  }

  getTrazaBien(token, rotulado): Observable<TrazaTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<TrazaTabla>(API_USERS_URL+'/alertas/bien/'+rotulado, {
      headers: httpHeaders,
    });
  }

  getDatosContables(token): Observable<ContablesTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<ContablesTabla>(API_USERS_URL+'/bien', {
      headers: httpHeaders,
    });
  }

  //Recupera todas las categorias existentes
  getAllUnidadesEntidad(token, entidad): Observable<UnidadModel[]> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UnidadModel[]>(API_USERS_URL+'/gestionEntidades/entidad/unidades/?nombre='+entidad, {
      headers: httpHeaders,
    });
  }

  //Recupera todas las categorias existentes
  getAllCategorias(token): Observable<CategoriasTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<CategoriasTabla>(API_USERS_URL+'/categoria/base', {
      headers: httpHeaders,
    });
  }

  //Recupera todos los usuarios existentes
  getAllCategoriasHijas(token, idPadre): Observable<SubCategoriasTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<SubCategoriasTabla>(API_USERS_URL+'/categoria/hijas/'+idPadre, {
      headers: httpHeaders,
    });
  }

  getAllTiposBien(token): Observable<TiposTabla> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<TiposTabla>(API_USERS_URL+'/bien/tipos', {
      headers: httpHeaders,
    });
  }

  /*getUserByToken(token): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}`, {
      headers: httpHeaders,
    });
  }*/

  //Temporal
  getUserByToken(id, nombreUsuario, nombre, apellidos, email, entidad, unidad): Observable<UserModel> {
    const user = new UserModel();
    user.id = id;
    user.nombreUsuario = nombreUsuario;
    user.nombre = nombre;
    user.apellidos = apellidos;
    user.email = email;
    user.entidad = entidad;
    user.unidad = unidad;

    /*if (!user) {
      return of(undefined);
    }*/

    return of(user);
  }
}
