import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthInterceptor } from '../../interceptors/auth.interceptor';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        console.error('Error fetching data:', err);
      },
    });
  }
}
