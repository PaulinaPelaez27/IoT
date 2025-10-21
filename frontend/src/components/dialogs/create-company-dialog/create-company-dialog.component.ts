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
  selector: 'app-create-company-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-company-dialog.component.html',
  styleUrls: ['./create-company-dialog.component.css'],
})
export class CreateCompanyDialogComponent {
  localCompany: { name: string; address: string };

  constructor(public dialogRef: MatDialogRef<CreateCompanyDialogComponent>) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localCompany = { name: '', address: '' };
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
