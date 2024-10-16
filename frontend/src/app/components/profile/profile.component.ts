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
  emailExists: boolean = false;
  usernameExists: boolean = false;
  profileUpdateSuccess: boolean = false;
  deleteAccountForm!: FormGroup;
  deleteErrorMessage: string = '';
  showDeletePassword: boolean = false;
  isAdmin: boolean = false;

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

    this.deleteAccountForm = this.fb.group({
      password: ['', Validators.required],
    });

    this.loadUserData();

    this.passwordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });

    this.username = this.profileForm.get('username')?.value;
  }

  loadUserData(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      this.apiService.getUserProfile(token).pipe(
        catchError(error => {
          this.errorMessage = 'Error loading profile data';
          return of(null);
        })
      ).subscribe(
        (data: any) => {
          if (data) {
            this.profileForm.patchValue({
              name: data.name || '',
              surname: data.surname || '',
              username: data.username || '',
              email: data.email || ''
            });
            this.username = data.username;
          }
        }
      );
      this.apiService.checkAdminUser(token).pipe(
        catchError(error => {
          console.error('Error checking admin status', error);
          return of({ isAdmin: false });
        })
      ).subscribe((response: any) => {
        this.isAdmin = response.isAdmin;
      });
    } else {
      this.errorMessage = 'No token found. Please log in again.';
    }
  }


  onUpdateProfile(): void {
    if (this.profileForm.valid) {
      const token = sessionStorage.getItem('token');
      this.apiService.updateUserProfile(this.profileForm.value, token).pipe(
        catchError(error => {
          console.log(error);
          if (error.status === 409 && error.error.message === 'The user username already exists') {
            this.usernameExists = true;
          }
          if (error.status === 409 && error.error.message === 'The user email already exists'){
            this.emailExists = true;
          }
          return of(null);
        })
      ).subscribe(
        (response: any) => {
          console.log(response);
          if (response){
            this.profileUpdateSuccess = true;
            setTimeout(() => {
              this.resetErrors();
              this.profileUpdateSuccess = false;
            }, 2000);
            this.username = this.profileForm.get('username')?.value;
            const newToken = response.token;
            sessionStorage.setItem('token', newToken);
            console.log('Profile updated successfully');
          }

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
            this.passwordNotSame = false;

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
    // this.passwordMismatch = newPassword !== confirmPassword;
    // this.passwordNotSame = currentPassword === newPassword;
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

  resetErrors(): void {
    this.emailExists = false;
    this.usernameExists = false;
  }

  onDeleteAccount(): void {
    if (this.deleteAccountForm.valid) {
      const password = this.deleteAccountForm.get('password')?.value;
      const token = sessionStorage.getItem('token');
      this.apiService.deleteUserAccount(password, token).pipe(
        catchError(error => {
          console.log(error);
          this.deleteErrorMessage = 'Error deleting account. Please try again.';
          return of(null);
        })
      ).subscribe((response: any) => {
        if (response) {
          alert('Your account has been deleted successfully.');
          sessionStorage.removeItem('token');
          window.location.href = '/login'; // Redirige a la página de inicio de sesión
        }
      });
    }
  }

  toggleDeletePassword(): void {
    this.showDeletePassword = !this.showDeletePassword;
  }
}
