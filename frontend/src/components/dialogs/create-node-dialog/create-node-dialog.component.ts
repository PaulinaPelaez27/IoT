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

import { NodeCreate } from '../../../models/node';
import { Status } from '../../../models/status';

@Component({
  selector: 'app-create-node-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './create-node-dialog.component.html',
  styleUrl: './create-node-dialog.component.css',
})
export class CreateNodeDialogComponent {
  localNode: NodeCreate;

  constructor(
    public dialogRef: MatDialogRef<CreateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.localNode = { name: '', location: '', status: Status.INACTIVE };
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localNode);
    } else {
      console.error('Form is invalid');
    }
  }
}
