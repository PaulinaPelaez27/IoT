import {
  Component,
  Inject,
  OnInit,
  signal,
  computed,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatChipGrid } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { Sensor, SensorCreate } from '../../../models/sensor';
import { Status } from '../../../models/status';
import { Node } from '../../../models/node';
import { Type } from '../../../models/type';
import { SensorService } from '../../../services/sensor.service';

import { AddSensorTypeDialogComponent } from '../add-sensor-type-dialog/add-sensor-type-dialog.component';

@Component({
  selector: 'app-add-sensors-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatChipGrid,
    MatDividerModule,
  ],
  templateUrl: './add-sensors-dialog.component.html',
  styleUrl: './add-sensors-dialog.component.css',
})
export class AddSensorsDialogComponent implements OnInit {
  node: Node;

  sensors = signal<Sensor[]>([]);
  selectedSensors = signal<Sensor[]>([]);
  createdSensors = signal<Sensor[]>([]);
  sensorTypesMap = new Map<number, Type>();

  sensorTypes: Type[] = [];
  separatorKeys = [ENTER, COMMA];

  newSensorForm = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    typeIds: [[] as number[], Validators.required],
  });

  showNewSensorForm = signal(false);
  private sensorService = inject(SensorService);

  constructor(
    private dialogRef: MatDialogRef<AddSensorsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) node: Node,
    private dialog: MatDialog
  ) {
    this.node = node;
    this.selectedSensors.set(node.sensors);
  }

  ngOnInit(): void {
    this.fetchSensors();
    this.fetchSensorTypes();
  }

  fetchSensors() {
    this.sensorService.getSensors().subscribe((sensors) => {
      const filtered = sensors.filter(
        (s) =>
          !this.selectedSensors().some((sel) => sel.id === s.id) && !s.nodeId
      );
      this.sensors.set(filtered);
    });
  }

  fetchSensorTypes() {
    this.sensorService.getSensorsTypes().subscribe((types) => {
      this.sensorTypes = types;
      types.forEach((t) => this.sensorTypesMap.set(t.id, t));
      if (!this.newSensorForm.get('typeIds')?.value?.length) {
        this.newSensorForm.patchValue({
          typeIds: types[0]?.id ? [types[0].id] : [],
        });
      }
    });
  }

  filteredSensors = computed(() =>
    this.sensors().filter(
      (s) => !this.selectedSensors().some((sel) => sel.id === s.id)
    )
  );

  compareFn = (a: number, b: number) => a === b;

  selectSensor(sensor: Sensor) {
    if (!this.selectedSensors().some((s) => s.id === sensor.id)) {
      this.selectedSensors.update((prev) => [...prev, sensor]);
    }
  }

  removeSensor(sensor: Sensor) {
    this.selectedSensors.update((prev) =>
      prev.filter((s) => s.id !== sensor.id)
    );
  }

  toggleNewSensorForm() {
    this.showNewSensorForm.set(!this.showNewSensorForm());
  }

  cancelNewSensor() {
    this.newSensorForm.setValue({ name: '', typeIds: [] });
    this.showNewSensorForm.set(false);
  }

  addNewSensorDraft() {
    if (this.newSensorForm.invalid) return;

    const dto: SensorCreate = {
      name: this.newSensorForm.value.name!.toUpperCase(),
      status: Status.INACTIVE,
      nodeId: null,
      typeIds: this.newSensorForm.value.typeIds!,
    };

    this.sensorService.createSensor(dto).subscribe((sensor) => {
      if (sensor) {
        this.fetchSensors();
        this.createdSensors.update((prev) => [...prev, sensor]);
        this.selectedSensors.update((prev) => [...prev, sensor]);
        this.cancelNewSensor();
      }
    });
  }

  // Rollback mechanism: delete created sensors if dialog is cancelled
  onCancel() {
    const created = [...this.createdSensors()];
    if (created.length > 0) {
      // Delete all created sensors before closing
      let deletedCount = 0;
      created.forEach((sensor) => {
        this.sensorService.deleteSensor(sensor.id).subscribe({
          complete: () => {
            deletedCount++;
            if (deletedCount === created.length) {
              this.dialogRef.close(false);
            }
          },
          error: () => {
            // Even if deletion fails, proceed to close dialog
            deletedCount++;
            if (deletedCount === created.length) {
              this.dialogRef.close(false);
            }
          },
        });
      });
    } else {
      this.dialogRef.close(false);
    }
  }

  confirm() {
    const sensorMap = new Map<number, Sensor>();
    [...this.selectedSensors(), ...this.createdSensors()].forEach((sensor) => {
      if (sensor.id) sensorMap.set(sensor.id, sensor);
    });
    const allSensors = Array.from(sensorMap.values());
    this.dialogRef.close({ nodeId: this.node.id, sensors: allSensors });
  }

  onSensorTypeChange(selectedTypeIds: number[]): void {
    if (selectedTypeIds.includes(-1)) {
      const currentTypes =
        this.newSensorForm.value.typeIds?.filter((id) => id !== -1) ?? [];

      this.dialog
        .open(AddSensorTypeDialogComponent, {
          width: '400px',
          data: {},
        })
        .afterClosed()
        .subscribe((newType: Type | null) => {
          if (newType) {
            this.sensorService
              .createSensorType(newType)
              .subscribe((createdType) => {
                this.sensorTypesMap.set(createdType.id, createdType);
                this.fetchSensorTypes();
                this.newSensorForm.patchValue({
                  typeIds: [...currentTypes, createdType.id],
                });
              });
          } else {
            this.newSensorForm.patchValue({ typeIds: currentTypes });
          }
        });
    }
  }
}
