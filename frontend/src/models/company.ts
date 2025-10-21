import { Project } from './project';
import { User } from './user';

export interface Company {
  id: number;
  name: string;
  address?: string;
  projects?: Project[];
  users?: User[];
}
