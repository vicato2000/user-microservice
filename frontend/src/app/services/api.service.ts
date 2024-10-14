import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../enviroments/environments';
import {ɵFormGroupValue, ɵTypedOrUntyped} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(token: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  updateUserRole(userId: string, role: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/admin/users/${userId}/role`, { role }, { headers });
  }

  getAllUsersPaginated(page: number, pageSize: number, token: string, search?: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let url = `${this.apiUrl}/admin/users?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${search}`;
    }
    return this.http.get(url, { headers });
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

  deleteUserAccount(password: string, token: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/users/delete`, { password }, { headers });
  }

  checkAdminUser(token: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/users/check-admin`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  deleteUserAdmin(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`, { headers });
  }

  getUserAuditLogs(userId: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/admin/users/${userId}/audits`, { headers });
  }

  // Solicita un email para restablecer la contraseña
  forgotPassword(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/forgot-password`, data);
  }

  // Restablece la contraseña con el token recibido
  resetPassword(token: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/reset-password/${token}`, data);
  }
}
