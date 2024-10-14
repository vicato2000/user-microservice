import { Component } from '@angular/core';
import {ApiService} from "../../services/api.service";
import {ActivatedRoute, RoutesRecognized} from "@angular/router";
import {catchError, of} from "rxjs";
import {jwtDecode} from "jwt-decode";
import { Router } from "@angular/router";


@Component({
  selector: 'app-user-audit',
  templateUrl: './user-audit.component.html',
  styleUrl: './user-audit.component.css'
})
export class UserAuditComponent {
  auditLogs: any[] = [];
  errorMessage: string = '';
  username: string | null = null;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
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

    if (userId && token) {
      this.apiService.getUserAuditLogs(userId, token).pipe(
        catchError(error => {
          this.errorMessage = 'Error retrieving audit logs';
          return of([]);
        })
      ).subscribe((data: any) => {
        this.auditLogs = data;
      });
    }
  }

  logout(): void {
    sessionStorage.removeItem('token');
    this.username = null;
    this.router.navigate(['/login']);
  }

}
