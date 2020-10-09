import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
//import { UserModel } from '../_models/user.model';
//import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from '../../modules/auth/_services/auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
//import { serialize } from 'v8';
import { BienesTabla } from '../../util/bienes-tabla';
import { CategoriasTabla } from '../../util/categorias-tabla';
import { AuthModel } from '../../modules/auth/_models/auth.model';
import { SubCategoriasTabla } from '../../util/subcategorias-tabla';
import { TiposTabla } from '../../util/tipos-tabla';
import { AtributoValorBienDTO } from '../../util/atributo-valor-bien.dto';
import { AtributosBien } from '../../util/atributos-bien';
//import { UnidadesTabla } from '../../util/unidades-tabla';
import { UnidadModel } from './model/unidad.model';
import { UsuariosTabla } from '../../util/usuarios-tabla';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private isLoadingSubject: BehaviorSubject<boolean>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  /*currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }*/

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    /*this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);*/
  }

  // public methods
  getAllMovimientos(): Observable<CategoriasTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllCategorias(auth.access_token).pipe(
      map((categorias: CategoriasTabla) => {
        return categorias;
      }),
      );
  }

  getAllCategorias(): Observable<CategoriasTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllCategorias(auth.access_token).pipe(
      map((categorias: CategoriasTabla) => {
        return categorias;
      }),
      );
  }

  getAllUnidadesEntidad(entidad): Observable<UnidadModel[]>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllUnidadesEntidad(auth.access_token, entidad).pipe(
      map((unidades: UnidadModel[]) => {
        return unidades;
      }),
      );
  }

  getAllCategoriasHijas(idPadre): Observable<SubCategoriasTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllCategoriasHijas(auth.access_token, idPadre).pipe(
      map((categorias: SubCategoriasTabla) => {
        return categorias;
      }),
      );
  }

  getAllBienes(): Observable<BienesTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllBienes(auth.access_token).pipe(
      map((bienes: BienesTabla) => {
        return bienes;
      }),
      );
  }

  getDetallesBien(idBien): Observable<AtributosBien>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getDetallesBien(auth.access_token, idBien).pipe(
      map((bienes: AtributosBien) => {
        return bienes;
      }),
    );
  }

  getUsuariosUnidad(idUnidad, rol): Observable<UsuariosTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getUsuariosUnidad(auth.access_token, idUnidad, rol).pipe(
      map((users: UsuariosTabla) => {
        return users;
      }),
      );
  }

  // private methods
  private getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
