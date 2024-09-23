import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from "../../services/api.service";
import {catchError, of, tap} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.apiService.loginUser(this.loginForm.value).pipe(
        tap(response => {
          console.log('User logged in successfully', response);
          sessionStorage.setItem('token', response.token);
          // Redirigir al dashboard tras el login exitoso
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          console.error('Error during login', error);
          this.errorMessage = 'Invalid login credentials. Please try again.';
          return of(null);  // Retorna un observable vacío para manejar el error
        })
      ).subscribe();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
