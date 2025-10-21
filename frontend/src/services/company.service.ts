import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Company } from '../models/company';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  constructor(private gService: GeneralService) {}

  getCompanies(): Observable<Company[]> {
    return this.gService.getData('companies');
  }

  createCompany(company: Omit<Company, 'id'>) {
    return this.gService.postData('companies', company);
  }

  updateCompany(company: Company) {
    return this.gService.putData(`companies/${company.id}`, company);
  }

  deleteCompany(companyId: number) {
    return this.gService.deleteData(`companies/${companyId}`);
  }
}
