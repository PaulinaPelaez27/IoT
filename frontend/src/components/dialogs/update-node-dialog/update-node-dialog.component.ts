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

import { ProjectService } from '../../../services/project.service';

import { Node } from '../../../models/node';
import { Project } from '../../../models/project';

@Component({
  selector: 'app-update-node-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './update-node-dialog.component.html',
  styleUrl: './update-node-dialog.component.css',
})
export class UpdateNodeDialogComponent {
  localNode: Node;
  projects: Project[] = [];

  constructor(
    public dialogRef: MatDialogRef<UpdateNodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public node: Node,
    private projectService: ProjectService
  ) {
    // shallow copy – use structuredClone for deep copy if nested objects exist
    this.localNode = { ...node };
    this.fetchData();
  }

  fetchData() {
    this.projectService.getProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      },
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.dialogRef.close(this.localNode);
    }
  }
}
