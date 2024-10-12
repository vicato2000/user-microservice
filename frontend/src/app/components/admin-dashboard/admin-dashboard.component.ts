import {Component, OnInit} from '@angular/core';
import {ApiService} from "../../services/api.service";
import {Router} from "@angular/router";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit{

  users: any[] = [];
  errorMessage: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');  // Asegúrate de tener el token
    if (token) {
      this.apiService.getAllUsers(token).pipe(
        catchError(error => {
          this.errorMessage = 'Error retrieving user data.';
          console.error(error);
          return of([]);
        })
      ).subscribe((data: any) => {
        this.users = data;
      });
    } else {
      this.router.navigate(['/login']);
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
        });
      }
    }
  }

}
