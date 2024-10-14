import { Component, OnInit } from '@angular/core';
import { ApiService } from "../../services/api.service";
import { Router } from "@angular/router";
import { catchError, of } from "rxjs";
import {jwtDecode} from "jwt-decode";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {

  users: any[] = [];
  errorMessage: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 10;
  searchQuery: string = '';
  username: string | null = null;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
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
      this.loadUsers(this.currentPage);
    } else {
      this.router.navigate(['/login']);
    }

  }

  loadUsers(page: number): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.apiService.getAllUsersPaginated(page, this.pageSize, token, this.searchQuery).pipe(
        catchError(error => {
          this.errorMessage = 'Error retrieving user data.';
          console.error(error);
          return of({ data: [], totalPages: 1 });
        })
      ).subscribe((response: any) => {
        this.users = response.users;
        console.log(this.users);
        this.totalPages = response.totalPages;
        this.currentPage = page;
      });
    }
  }


  deleteUser(userId: string): void {
    const token = sessionStorage.getItem('token');
    if (confirm('Are you sure you want to delete this user?')) {
      if (token) {
        this.apiService.deleteUserAdmin(userId, token).pipe(
          catchError(error => {
            this.errorMessage = 'Error deleting user.';
            console.error(error);
            return of(null);
          })
        ).subscribe(() => {
          this.users = this.users.filter(user => user._id !== userId);
          this.loadUsers(this.currentPage);  // Recargar la página actual
        });
      }
    }
  }


  changeUserRole(userId: string, role: string): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.apiService.updateUserRole(userId, role, token).subscribe({
        next: (res) => {
          this.loadUsers(this.currentPage);
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Error updating user role';
        }
      });
    }
  }

  // Función para búsqueda de usuarios
  searchUsers(): void {
    this.loadUsers(1);
  }

  // Funciones para paginación

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.username = null;
    this.router.navigate(['/login']);
  }
}
