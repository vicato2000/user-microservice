import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ApiService} from "../../services/api.service";
import {catchError, of, tap} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.apiService.registerUser(this.registerForm.value).pipe(
        tap(response => {
         sessionStorage.setItem('token', response.token);
          this.router.navigate(['/dashboard']);
        }),
        catchError(error => {
          console.error('Error during registration:', error);
          this.errorMessage = 'Error registering user. Please try again.';
          return of(null);
        })
      ).subscribe();
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

}
