import { Component } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { GeneralService } from '../../services/general.service';
import { AlertService } from '../../app/_alert/alert.service';
import { User } from '../../models/user';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
})
export class UserInfoComponent {
  user: User | null = null;
  passwordForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private generalService: GeneralService
  ) {
    this.user = this.authService.getCurrentUser();

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {}
    );
  }

  passwordMatchValidator = (
    formGroup: AbstractControl
  ): ValidationErrors | null => {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };

  changePassword() {
    const error = this.passwordMatchValidator(this.passwordForm);
    if (this.passwordForm.invalid || error) {
      this.alertService.error('Las contraseñas no coinciden.');
      return;
    }
    const { currentPassword, newPassword } = this.passwordForm.value;
    this.generalService
      .putData(`users/${this.user?.id}/password`, {
        currentPassword,
        newPassword,
      })
      .subscribe({
        next: (_res: any) => {
          this.alertService.success('Contraseña cambiada con éxito.');
          this.passwordForm.reset();
        },
        error: (err: any) => {
          console.error('Error al cambiar la contraseña :', err);
          this.alertService.error(
            'Error al cambiar la contraseña. Por favor, inténtelo de nuevo.'
          );
        },
      });
  }
}
