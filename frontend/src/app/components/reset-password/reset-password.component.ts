import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {ActivatedRoute} from "@angular/router";
import {catchError, of} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit{

  resetPasswordForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  passwordMismatch: boolean = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.resetPasswordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  checkPasswordMatch(): void {
    const newPassword = this.resetPasswordForm.get('newPassword')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;
    this.passwordMismatch = newPassword !== confirmPassword;
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && !this.passwordMismatch) {
      this.apiService.resetPassword(this.token, this.resetPasswordForm.value).pipe(
        catchError(error => {
          this.errorMessage = 'Error resetting password.';
          console.error(error);
          return of(null);
        })
      ).subscribe(response => {
        if (response) {
          this.successMessage = 'Password has been reset successfully!';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        }
      });
    }
  }

}
