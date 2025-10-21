import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartData } from 'chart.js';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectorRef } from '@angular/core';

import { Platform } from '@angular/cdk/platform';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { SensorService } from '../../services/sensor.service';
import { ProjectService } from '../../services/project.service';
import { NodeService } from '../../services/node.service';
import { ReadingService } from '../../services/reading.service';
import { Observable, Subscription } from 'rxjs';

import { SensorType } from '../../models/sensor';
import { userInfo } from 'node:os';
import { User } from '../../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    BaseChartDirective,
    MatCardModule,
    CommonModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class DashboardComponent implements OnInit, OnDestroy {
  //user
  public user$: Observable<User | null>;
  // projects
  selectedProjectId: number | null = null;
  projectsList: { id: number; name: string }[] = [];
  // nodes
  selectedNodeId: number | null = null;
  nodesList: { id: number; name: string }[] = [];
  // sensor
  selectedSensorId: number | null = null;
  sensorsList: { id: number; name: string }[] = [];
  // sensor types
  typesList: SensorType[] = [];
  selectedTypeId: number | null = null;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  /* ———————————————————————————————————————————————— */
  // ►  1) Injections
  private authService = inject(AuthService);
  private readingService = inject(ReadingService);
  private sensorService = inject(SensorService);
  private nodeService = inject(NodeService);
  private projectService = inject(ProjectService);
  private cdr = inject(ChangeDetectorRef);
  private platform = inject(Platform);

  /* ———————————————————————————————————————————————— */
  // ►  2) Chart initial
  public lineChartType: 'line' = 'line';
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Valor',
        tension: 0.3,
        fill: true,
        borderColor: '#3f51b5',
        backgroundColor: 'rgba(63,81,181,.25)',
      },
    ],
  };
  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: false,
    scales: {
      x: { title: { display: true, text: 'Hora' } },
      y: { title: { display: true, text: 'Valor' } },
    },
  };

  constructor() {
    this.user$ = this.authService.user$;
  }

  /* ———————————————————————————————————————————————— */
  // ►  3) Gestion subscription
  private sub?: Subscription;

  async ngOnInit(): Promise<void> {
    this.fetchProjectsByCompanyId();
  }

  async fetchProjectsByCompanyId(): Promise<void> {
    const user = await firstValueFrom(this.user$);
    if (!user) {
      console.error('User not available');
      return;
    }

    if (!user.companyId && user.role === 'admin') {
      user.companyId = 0;
    }

    this.projectService
      .getProjectsByCompanyId(user.companyId ? user.companyId : 0)
      .subscribe({
        next: (projects) => {
          this.projectsList = projects;
          this.nodesList = projects.flatMap(
            (project: any) => project.nodes || []
          );
        },
        error: (err) => {
          console.error('Error fetching projects:', err);
        },
      });
  }

  async fetchNodesByProjectId(): Promise<void> {
    this.clearData();

    if (this.selectedProjectId === null) {
      this.nodesList = [];
      return;
    }

    this.nodeService.getNodesByProjectId(this.selectedProjectId).subscribe({
      next: (nodes) => {
        this.nodesList = nodes.map((node) => ({
          id: node.id,
          name: node.name,
        }));
      },
      error: (err) => {
        console.error('Error fetching nodes:', err);
      },
    });
  }

  fetchSensorsByNodeId(): void {
    if (this.selectedNodeId === null) {
      this.sensorsList = [];
      return;
    }

    this.sensorService.getSensorsByNodeId(this.selectedNodeId).subscribe({
      next: (sensors) => {
        this.sensorsList = sensors.map((sensor) => ({
          id: sensor.id,
          name: sensor.name,
        }));
      },
      error: (err: any) => {
        console.error('Error fetching sensors:', err);
      },
    });
  }

  fetchSensorTypesBySensorId(): void {
    if (this.selectedSensorId === null) {
      this.typesList = [];
      return;
    }

    this.sensorService
      .getSensorTypeBySensorId(this.selectedSensorId)
      .subscribe({
        next: (sensorTypes) => {
          this.typesList = sensorTypes;
        },
        error: (err) => {
          console.error('Error fetching sensor types:', err);
        },
      });
  }

  clearData(): void {
    this.selectedNodeId = null;
    this.selectedSensorId = null;
    this.selectedTypeId = null;
    // data chart
    this.lineChartData.labels = [];
    this.lineChartData.datasets[0].data = [];
    this.sub?.unsubscribe();
    this.cdr.detectChanges();
    this.chart?.update();
  }

  subReadings(): void {
    this.sub?.unsubscribe();

    if (this.selectedSensorId !== null && this.selectedTypeId !== null) {
      this.sub = this.readingService
        .streamReadings(this.selectedSensorId, this.selectedTypeId)
        .subscribe((readings) => {
          const ordered = readings.reverse();

          this.lineChartData.labels = ordered.map(
            (r: { timestamp: string | number | Date }) =>
              new Date(r.timestamp).toLocaleTimeString()
          );

          this.lineChartData.datasets[0].data = ordered.map(
            (r: { value: any }) => {
              return r.value;
            }
          );

          this.cdr.detectChanges();
          this.chart?.update();
        });
    } else {
      console.warn(
        'Sensor ID and Type ID must be selected before subscribing to readings.'
      );
    }
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
