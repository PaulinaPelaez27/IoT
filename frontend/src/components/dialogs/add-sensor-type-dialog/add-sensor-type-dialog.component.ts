import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-add-sensor-type-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './add-sensor-type-dialog.component.html',
  styleUrls: ['./add-sensor-type-dialog.component.css'],
})
export class AddSensorTypeDialogComponent {
  name: string = '';
  unit: string = '';
  description: string = '';

  constructor(
    public dialogRef: MatDialogRef<AddSensorTypeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel() {
    this.dialogRef.close();
  }

  confirm() {
    if (!this.name.trim() || !this.unit.trim()) {
      // You can add more validation logic here if needed
      return;
    }

    this.dialogRef.close({
      name: this.name.trim(),
      unit: this.unit.trim(),
      description: this.description.trim(),
    });
  }
}
