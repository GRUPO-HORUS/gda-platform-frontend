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
