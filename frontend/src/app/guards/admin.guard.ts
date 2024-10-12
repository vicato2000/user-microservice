import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";
import {jwtDecode} from "jwt-decode";
import {catchError, map, of, tap} from "rxjs";

export const adminGuard: CanActivateFn = (route, state) => {
  const apiService = inject(ApiService);
  const router = inject(Router);
  let r: any;

  const token = sessionStorage.getItem('token');

  if (token) {
    return apiService.checkAdminUser(token).pipe(
      tap((response) => {
        // Aquí puedes ver y almacenar la respuesta
        console.log('Respuesta de checkAdminUser:', response);
      }),
      map((response) => {
        if (response.isAdmin) {
          return true;
        } else {
          router.navigate(['/dashboard']);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error en checkAdminUser:', error);
        router.navigate(['/login']);
        return of(false);
      })
    );
  }else{
    console.log('No token found');
    router.navigate(['/login']);
    return of(false);
  }

};
