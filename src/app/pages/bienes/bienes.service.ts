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
import { ContablesTabla } from '../../util/contables-tabla';
import { TrazaTabla } from '../../util/traza-tabla';
import { AsignacionesTabla } from '../../util/asignaciones-tabla';
import { AtributosCategoria } from '../../util/atributos-categoria';
import { BienModel } from './model/bien.model';

@Injectable({
  providedIn: 'root',
})
export class BienesService implements OnDestroy {
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
  getAllCategorias(): Observable<CategoriasTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllCategorias(auth.access_token).pipe(
      map((categorias: CategoriasTabla) => {
        return categorias;
      }),
      );
  }

  getAllTiposBien(): Observable<TiposTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllTiposBien(auth.access_token).pipe(
      map((tipos: TiposTabla) => {
        return tipos;
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

  getAtributosCategoria(idCategoria): Observable<AtributosCategoria>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAtributosCategoria(auth.access_token, idCategoria).pipe(
      map((bienes: AtributosCategoria) => {
        return bienes;
      }),
    );
  }

  getAtributosBien(idBien): Observable<AtributosBien>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getDetallesBien(auth.access_token, idBien).pipe(
      map((bienes: AtributosBien) => {
        return bienes;
      }),
    );
  }

  getAsignacionesBien(idBien): Observable<AsignacionesTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAsignacionesBien(auth.access_token, idBien).pipe(
      map((asignaciones: AsignacionesTabla) => {
        return asignaciones;
      }),
    );
  }

  getTrazaBien(rotulado): Observable<TrazaTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getTrazaBien(auth.access_token, rotulado).pipe(
      map((bienes: TrazaTabla) => {
        return bienes;
      }),
      );
  }

  getDatosContables(): Observable<ContablesTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getDatosContables(auth.access_token).pipe(
      map((bienes: ContablesTabla) => {
        return bienes;
      }),
      );
  }

  crearBien(nuevoBien):Observable<any>{
    const auth = this.getAuthFromLocalStorage();
    //this.isLoadingSubject.next(true);
    return this.authHttpService.crearBien(auth.access_token, nuevoBien);/*.pipe(
      retry(1)
      ,catchError((err) => {
        console.error('err', err);
        let error = new Error();
        if(err.error.apierror.formatted){
          error.message = err.error.apierror.message;
        }else{
          error.message = "Ha ocurrido un error. Contacte al administrador."
        }
        return of(error);
      })
      ,finalize(() => this.isLoadingSubject.next(false))
    );*/
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
