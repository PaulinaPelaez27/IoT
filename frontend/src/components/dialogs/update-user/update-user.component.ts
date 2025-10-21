import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../models/user';
import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';

@Component({
  standalone: true,
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class UpdateUserComponent {
  localUser: User;
  companies: Company[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
    private companyService: CompanyService
  ) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localUser = { ...user };
  }

  ngOnInit() {
    if (this.localUser.role === 'user') {
      this.companyService.getCompanies().subscribe({
        next: (companies) => {
          this.companies = companies;
        },
        error: (err) => {
          console.error('Error fetching companies:', err);
        },
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localUser);
    }
  }
}
