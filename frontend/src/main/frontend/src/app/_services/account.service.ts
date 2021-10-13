import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';
import { User } from '@app/_models/user.model';
import { AppConstants } from '@app/_constants/app.constants';

@Injectable({ providedIn: 'root' })
export class AccountService {

  private user = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('user')) as User);
  public user$ = this.user.asObservable();

  constructor(private http: HttpClient, private constants: AppConstants) { }

  login(reqPayload: any): Observable<any> {
    return this.http.post(environment.host + this.constants.ZOEY_ADMIN + this.constants.LOGIN, reqPayload);
  }

  devLogin(username: string): Observable<any> {    
    const headers = new HttpHeaders({"username": username}); 
    return this.http.get(environment.host + this.constants.ZOEY_ADMIN + this.constants.GET_USER, { headers });
  }

  logout(): boolean {
    sessionStorage.removeItem('user');
    this.user.next(null);

    return true;
  }

  register(reqPayload: any): Observable<any> {

    // HttpParams are immutable
    // append/set return new instances
    let params = new HttpParams();

    if (reqPayload['roles']) {
      params = params.append('roles', reqPayload['roles']);
    } 

    if (reqPayload['admin_level']) {
      params = params.append('admin_level', reqPayload['admin_level']);
    } else {
      params = params.append('admin_level', 'basic');
    }

    return this.http.post<User>(environment.host + this.constants.ZOEY_ADMIN + this.constants.REGISTER, reqPayload, { params: params });
  }

  saveUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
    this.user.next(user);
  }

  getUser(): User {
    return this.user.value;
  }
}
