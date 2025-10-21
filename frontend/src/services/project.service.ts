import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Project } from '../models/project';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private gService: GeneralService) {}

  getProjects(): Observable<Project[]> {
    return this.gService.getData('projects');
  }

  getProjectsByCompanyId(companyId: number): Observable<Project[]> {
    return this.gService.getData(`projects/company/${companyId}`);
  }

  getProjectById(id: number) {
    return this.gService.getData(`projects/${id}`);
  }

  createProject(project: Project) {
    return this.gService.postData(`projects`, project);
  }

  updateProject(id: number, project: Project) {
    return this.gService.putData(`projects/${id}`, project);
  }

  deleteProject(id: number) {
    return this.gService.deleteData(`projects/${id}`);
  }
}
