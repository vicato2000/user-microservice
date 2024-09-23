import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  username: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserFromToken();
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
