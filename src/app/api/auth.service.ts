import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';
import {tap} from 'rxjs/operators';
import {StorageMap} from '@ngx-pwa/local-storage';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token: any;
  constructor(
    private http: HttpClient,
    private storage: StorageMap,
    private env: EnvService,
    private afAuth: AngularFireAuth
  ) {
    storage.get('token').subscribe((value: any) => {
      if (value) {
        this.token = value;
        this.isLoggedIn = true;
        // console.log('token loaded', this.token);
      }
    });
  }

  // tslint:disable-next-line:ban-types
  login(email: string, password: string) {
    return this.http.post(this.env.API_URL + 'auth/login',
      {email, password}
    ).pipe(
      tap(token => {
        this.storage.set('token', token)
          .subscribe(
            () => {
              console.log('Token Stored' + token);
            },
            error => console.error('Error storing item', error)
          );
        // Authenticate this user on firebase
        this.afAuth.signInWithEmailAndPassword(email, password)
          .then(
            res => {
              console.log('Firebase auth done: ');
            },
            err => (err));
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );
  }

  // tslint:disable-next-line:ban-types
  register(fName: String, lName: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/register',
      {fName, lName, email, password}
    );
  }

  logout() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });

    return this.http.get(this.env.API_URL + 'auth/logout', { headers })
      .pipe(
        tap(data => {
          this.storage.delete('token');
          this.isLoggedIn = false;
          delete this.token;
          return data;
        })
      );
  }

  user() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });

    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers })
      .pipe(
        tap(user => {
          return user;
        })
      );
  }

  getToken() {
    return this.storage.get('token').subscribe(
      data => {
        this.token = data;
        // console.log('token got: ' + this.token);

        if (this.token != null) {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn = false;
      }
    );
  }

  getCities() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });

    return this.http.get(this.env.API_URL + 'events/getcities', {headers});
  }

  getCurrencies() {
    const headers = new HttpHeaders({
      Authorization: this.token.token_type + ' ' + this.token.access_token
    });

    return this.http.get(this.env.API_URL + 'getcurcodes', {headers});
  }
}
