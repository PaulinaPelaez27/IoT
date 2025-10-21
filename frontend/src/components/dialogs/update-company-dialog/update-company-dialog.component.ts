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

@Component({
  selector: 'app-update-company-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './update-company-dialog.component.html',
  styleUrl: './update-company-dialog.component.css',
})
export class UpdateCompanyDialogComponent {
  localCompany: Company;

  constructor(
    public dialogRef: MatDialogRef<UpdateCompanyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public company: Company
  ) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localCompany = { ...company };
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localCompany);
    }
  }
}
