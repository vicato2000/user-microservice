import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {catchError, of} from "rxjs";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit{

  forgotPasswordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.apiService.forgotPassword(this.forgotPasswordForm.value).pipe(
        catchError(error => {
          this.errorMessage = 'Error sending reset email.';
          console.error(error);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.successMessage = 'Password reset email sent!';
        }
      });
    }
  }

}
