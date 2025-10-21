import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Node, NodeCreate } from '../models/node';
import { Observable } from 'rxjs';
import { SensorCreate } from '../models/sensor';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private gService: GeneralService) {}

  getNodes(): Observable<Node[]> {
    return this.gService.getData('nodes');
  }

  getNodeById(id: number): Observable<Node> {
    return this.gService.getData(`nodes/${id}`);
  }

  getNodesByProjectId(projectId: number): Observable<Node[]> {
    return this.gService.getData(`nodes/project/${projectId}`);
  }

  createNode(node: NodeCreate): Observable<Node> {
    return this.gService.postData('nodes', node);
  }

  updateNode(id: number, node: Node): Observable<Node> {
    return this.gService.putData(`nodes/${id}`, node);
  }

  deleteNode(id: number): Observable<void> {
    return this.gService.deleteData(`nodes/${id}`);
  }

  addSensorsToNode(nodeId: number, sensors: SensorCreate[]): Observable<Node> {
    return this.gService.postData(`nodes/${nodeId}/sensors`, sensors);
  }
}
