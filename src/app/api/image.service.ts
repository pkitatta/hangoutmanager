import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EnvService} from './env.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  token: any;
  constructor(
    private http: HttpClient,
    // private storage: Storage,
    private env: EnvService,
    private auth: AuthService,
  ) {
    this.token = auth.token;
  }

  uploadCoverPhoto(data: { hangoutId: any; photo: any; type: string; }, type: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.token.token_type + ' ' + this.auth.token.access_token
    });

    if (type === 'cover') {
      return this.http.post(this.env.API_URL + 'hangouts/postphoto', (data), {headers});
    } else {
      return this.http.post(this.env.API_URL + 'hangouts/postthumb', (data), {headers});
    }
  }

  deleteCover(param: { imageId: any; hangoutId: any }, type: any) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.auth.token.token_type + ' ' + this.auth.token.access_token
    });


    console.log('imageId: ', param.imageId);
    if (type === 'cover') {
      return this.http.post(this.env.API_URL + 'hangouts/deletecover', param, {headers});
    } else if (type === 'hangoutthumb') {
      return this.http.post(this.env.API_URL + 'hangouts/deletethumb', param, {headers});
    } else if (type === 'admin') {
      return this.http.delete(this.env.API_URL + 'deleteadminphoto/' + param.imageId, {headers});
    } else {
      return null;
    }
  }
}
