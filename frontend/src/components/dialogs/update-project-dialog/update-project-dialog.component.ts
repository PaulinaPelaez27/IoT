import { Component, Inject, OnInit } from '@angular/core';
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
import { Project } from '../../../models/project';
import { Company } from '../../../models/company';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-update-project-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './update-project-dialog.component.html',
  styleUrl: './update-project-dialog.component.css',
})
export class UpdateProjectDialogComponent implements OnInit {
  localProject: Project;
  companies: Company[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public project: Project,
    private companyService: CompanyService
  ) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localProject = { ...project };
  }

  ngOnInit() {
    this.fetchCompanies();
  }

  fetchCompanies() {
    this.companyService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
      error: (err) => {
        console.error('Error fetching companies:', err);
        // Handle error, e.g., show an alert
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localProject);
    }
  }

  trackByCompanyId(index: number, company: { id: number }) {
    return company.id;
  }
}
