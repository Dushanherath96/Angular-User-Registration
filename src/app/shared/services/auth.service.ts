import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  baseURL = 'http://localhost:5163/api';

  createUser(formData: any) {
    return this.http.post(this.baseURL + '/signup', formData);
  }
}
