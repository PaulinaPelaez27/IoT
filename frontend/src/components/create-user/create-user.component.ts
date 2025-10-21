import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AlertService } from '../../app/_alert/alert.service';
import { User, UserCreate } from '../../models/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../models/company';

@Component({
  standalone: true,
  selector: 'app-create-user',
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class createUserComponent {
  user: UserCreate = {
    name: '',
    email: '',
    password: '',
    role: '',
    company: '',
  };

  companies: Company[] = [];

  // TODO: Replace with actual fetch from backend
  roles = [
    { value: 'admin', viewValue: 'Administrador' },
    { value: 'user', viewValue: 'Usuario' },
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private companyService: CompanyService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Fetch companies from the backend
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (error) => {
        console.error('Error fetching companies:', error);
        this.alertService.error('Error al cargar las empresas.');
      },
    });
  }

  createUser() {
    const userData: UserCreate = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
      company: this.user.company,
    };

    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.role
    ) {
      console.error('All fields are required.');
      this.alertService.error('Se requiere completar todos los campos.');
      return;
    }
    this.authService.register(userData).subscribe({
      next: (response) => {
        this.alertService.success(`Usuario creado exitosamente.`);
      },
      error: (error) => {
        this.alertService.error('Error al crear el usuario.');
      },
    });
  }
}
