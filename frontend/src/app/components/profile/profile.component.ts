import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { catchError, tap, timeInterval } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  errorMessage: string = '';
  passwordMismatch: boolean = false;
  passwordNotSame: boolean = false;
  username: string = '';
  passwordChangeSuccess: boolean = false;
  currentPasswordIncorrect: boolean = false;
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(private fb: FormBuilder, private apiService: ApiService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });

    this.loadUserData();

    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
  }

  loadUserData(): void {
    const token = sessionStorage.getItem('token');
    this.apiService.getUserProfile(token).pipe(
      catchError(error => {
        this.errorMessage = 'Error loading profile data';
        return of(null);
      })
    ).subscribe(
      (data: any) => {
        if (data) {
          this.profileForm.patchValue({
            name: data.name,
            surname: data.surname,
            username: data.username,
            email: data.email,
          });
          this.username = data.username;
        }
      }
    );
  }

  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      this.apiService.updateUserProfile(this.profileForm.value).pipe(
        catchError(error => {
          this.errorMessage = 'Error updating profile';
          return of(null);
        })
      ).subscribe(
        (response: any) => {
          console.log('Profile updated successfully');
        }
      );
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid && !this.passwordMismatch) {
      const token = sessionStorage.getItem('token');
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.apiService.changePassword({ oldPassword: currentPassword, newPassword }, token).pipe(
        catchError(error => {
          console.log(error);
          if (error.status === 401) {
            console.log('Current password is incorrect');
            this.currentPasswordIncorrect = true;
            return of(null);
          }else if (error.status === 400) {
            console.log('Current password should not be the same as new password');
            this.passwordNotSame = true;
            return of(null);
          } else {
          this.errorMessage = 'Error changing password';
          return of(null);
        }
        })
      ).subscribe(
        (response: any) => {
          if (response) {
            console.log('Password changed successfully');
            this.currentPasswordIncorrect = false;
            this.passwordNotSame = false

            this.passwordChangeSuccess = true;
            this.passwordForm.reset();
            setTimeout(() => {
              this.passwordChangeSuccess = false;
            }, 2000);
          }

        }
      );
    }
  }

  checkPasswordMatch(): void {
    const currentPassword = this.passwordForm.get('currentPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    this.passwordMismatch = newPassword !== confirmPassword;
    this.passwordNotSame = currentPassword === newPassword;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    window.location.href = '/login';
  }

  toggleCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
