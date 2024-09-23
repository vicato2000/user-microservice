import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;  // URL de tu backend

  constructor(private http: HttpClient) {}

  getUserProfile(token: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  loginUser(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, credentials);
  }

  updateUserProfile(userData: any, token: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/profile`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  changePassword(passwordData: any, token: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/password`, passwordData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
