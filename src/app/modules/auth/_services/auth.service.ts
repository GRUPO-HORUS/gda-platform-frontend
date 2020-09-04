import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../_models/user.model';
import { AuthModel } from '../_models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
//import { serialize } from 'v8';
import { RolModel } from '../_models/rol.model';
import { UsuariosTabla } from '../../../util/usuarios-tabla';
import { RolesTabla } from '../../../util/roles-tabla';
import { UserRolDto } from '../../../util/user-rol.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private isLoadingSubject: BehaviorSubject<boolean>;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  //login(email: string, password: string): Observable<UserModel> {
    login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.login(email, password).pipe(
      map((auth: AuthModel) => {
        const result = this.setAuthFromLocalStorage(auth);  //guarda el token en localStorage
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        //console.error('err', err);
        let error = new Error();
        if(!err.error.apierror.formatted){
          error.message = err.error.apierror.message;
        }else{
          error.message = "Ha ocurrido un error. Contacte al administrador."
        }
        
        return of(error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.access_token) {
      //console.log("Indefinido");
      return of(undefined);
    }
    this.isLoadingSubject.next(true);

    //return this.authHttpService.getUserByToken(auth.access_token).pipe(
    return this.authHttpService.getUserByToken(auth.idUsuario, auth.nombreUsuario, auth.nombre, auth.apellidos, auth.correo).pipe(
      map((user: UserModel) => {
        //console.log(user);
        if (user) {
          //console.log("Trae usuario");
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  getAllRols(): Observable<RolesTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllRols(auth.access_token).pipe(
      map((roles: RolesTabla) => {
        return roles;
      }),
      );
  }

  asignRols(user: UserRolDto){
    const auth = this.getAuthFromLocalStorage();
    this.authHttpService.asignRols(auth.access_token, user).subscribe(response => {
      console.log(response);

    }, error => {
      console.log(error);
    });
  }

  getAllUsers(): Observable<UsuariosTabla>{
    const auth = this.getAuthFromLocalStorage(); 
    return this.authHttpService.getAllUsers(auth.access_token).pipe(
      map((users: UsuariosTabla) => {
        return users;
      }),
      );
  }

  // need create new user then login
  registration(user: UserModel): Observable<any> {
    this.isLoadingSubject.next(true);
    return this.authHttpService.createUser(user).pipe(
      map(() => {
        this.isLoadingSubject.next(false);
      }),
      switchMap(() => this.login(user.email, user.credencial)),
      catchError((err) => {
        //console.error('err', err);
        //return of(undefined);

        let error = new Error();
        if(!err.error.apierror.formatted){
          error.message = err.error.apierror.message;
        }else{
          error.message = "Ha ocurrido un error. Contacte al administrador."
        }
        return of(error);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }
  // private methods
  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    // store auth accessToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (auth && auth.access_token) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

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

  getUserFromLocalStorage(): AuthModel {
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
