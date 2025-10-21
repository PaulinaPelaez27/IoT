import { Project } from './project';
import { Sensor } from './sensor';
import { Status } from './status';

export interface NodeCreate {
  name: string;
  location: string;
  projectId?: number;
  status: Status;
}

export interface Node extends NodeCreate {
  id: number;
  project: Project;
  sensors: Sensor[];
}
