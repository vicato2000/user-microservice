import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import {ApiService} from "../../services/api.service";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  username: string | null = null;
  isAdmin: boolean = false;

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUserFromToken();

    const token = sessionStorage.getItem('token');
    if (token) {
      this.apiService.checkAdminUser(token).pipe(
        catchError(error => {
          console.error('Error checking admin status', error);
          return of({ isAdmin: false });
        })
      ).subscribe((response: any) => {
        this.isAdmin = response.isAdmin;
      });
    }
  }

  loadUserFromToken(): void {
    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);

        console.log('Decoded token:', decodedToken);

        this.username = decodedToken.username || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        this.username = null;
      }
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.username = null;
    this.router.navigate(['/login']);
  }

}
