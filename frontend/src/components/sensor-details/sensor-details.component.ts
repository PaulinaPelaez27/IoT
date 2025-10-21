import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

import { Sensor } from '../../models/sensor';
import { SensorService } from '../../services/sensor.service';

import { AlertService } from '../../app/_alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-sensor-details',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
  ],
  templateUrl: './sensor-details.component.html',
  styleUrls: ['./sensor-details.component.css'],
})
export class SensorDetailsComponent implements OnInit {
  sensor: Sensor | null = null;

  constructor(
    private sensorService: SensorService,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam !== null ? parseInt(idParam, 10) : null;
    if (id !== null) {
      this.sensorService.getSensorById(id).subscribe(
        (data) => {
          this.sensor = data;
        },
        (error) => {
          this.alertService.error('Error al cargar los detalles del sensor');
        }
      );
    }
  }

  sensorTypesDisplay(): string {
    if (!this.sensor || !this.sensor.types || this.sensor.types.length === 0) {
      return 'No types available';
    }
    return this.sensor.types.map((type) => type.name).join(', ');
  }
}
