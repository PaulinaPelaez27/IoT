import { Company } from './company';
import { Node } from './node';

export interface Project {
  id: number;
  name: string;
  description?: string;
  companyId?: number;
  company?: Company;
  nodes?: Node[];
}
