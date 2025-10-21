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
import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-create-project-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-project-dialog.component.html',
  styleUrl: './create-project-dialog.component.css',
})
export class CreateProjectDialogComponent {
  localProject: {
    name: string;
    description: string;
    companyId: number | null;
  };

  companies: Company[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyService: CompanyService
  ) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localProject = { name: '', description: '', companyId: null };
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localProject);
    } else {
      console.error('Form is invalid');
    }
  }
}
