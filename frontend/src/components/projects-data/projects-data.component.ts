import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project';
// add dialogs
import { UpdateProjectDialogComponent } from '../dialogs/update-project-dialog/update-project-dialog.component';
import { CreateProjectDialogComponent } from '../dialogs/create-project-dialog/create-project-dialog.component';

import { AlertService } from '../../app/_alert/alert.service';

@Component({
  selector: 'app-projects-data',
  imports: [
    CommonModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './projects-data.component.html',
  styleUrls: ['./projects-data.component.css'],
})
export class ProjectsDataComponent implements OnDestroy {
  projects: Project[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private alertService: AlertService
  ) {}
  ngOnInit() {
    this.fetchProjects();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchProjects() {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (err) => {
          console.error('Error fetching projects:', err);
          this.alertService.error('Failed to fetch projects');
        },
      });
  }

  openUpdateDialog(project: Project) {
    if (!project) {
      console.error('No project data provided for update dialog');
      return;
    }
    const dialogRef = this.dialog.open(UpdateProjectDialogComponent, {
      data: { ...project },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onUpdate(result);
      }
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateProjectDialogComponent, {
      data: { name: '', description: '', companies: [] }, // Default values for a new project
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.onCreate(result);
      }
    });
  }

  onCreate(project: Project) {
    if (!project) {
      console.error('No project data provided for creation');
      return;
    }
    this.projectService.createProject(project).subscribe({
      next: () => {
        this.alertService.success('Proyecto creado exitosamente.');
        this.fetchProjects();
      },
      error: (err) => {
        console.error('Error creating project:', err);
        this.alertService.error('Error al crear el proyecto.');
      },
    });
  }

  onUpdate(project: Project) {
    if (!project) {
      console.error('No project data provided for update');
      return;
    }
    this.projectService.updateProject(project.id, project).subscribe({
      next: () => {
        this.alertService.success('Proyecto actualizado exitosamente.');
        this.fetchProjects();
      },
      error: (err) => {
        console.error('Error updating project:', err);
        this.alertService.error('Error al actualizar el proyecto.');
      },
    });
  }

  onDelete(project: Project) {
    if (!project) {
      console.error('No project data provided for deletion');
      return;
    }
    this.projectService.deleteProject(project.id).subscribe({
      next: () => {
        this.alertService.success('Proyecto eliminado exitosamente.');
        this.fetchProjects();
      },
      error: (err) => {
        console.error('Error deleting project:', err);
        this.alertService.error('Error al eliminar el proyecto.');
      },
    });
  }

  trackByProjectId(index: number, project: Project): number {
    return project.id;
  }
}
