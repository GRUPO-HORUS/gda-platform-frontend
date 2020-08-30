import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { UserModel } from '../../_models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../_models/auth.model';

import { UsersTable } from '../../../../_helpers/fake/fake-db/users.table';

//const API_USERS_URL = `${environment.apiUrl}/users`;
const API_USERS_URL = 'http://localhost:8081/api/v1';

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
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
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
  getUserByToken(token: string): Observable<UserModel> {
    const user = UsersTable.users.find((u) => {
      //return u.access_token === token;
      return u.accessToken === 'access-token-8f3ae836da744329a6f93bf20594b5cc';
    });

    if (!user) {
      return of(undefined);
    }

    return of(user);
  }
}
