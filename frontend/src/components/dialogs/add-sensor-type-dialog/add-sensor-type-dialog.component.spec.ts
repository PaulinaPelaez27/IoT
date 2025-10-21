import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorTypeDialogComponent } from './add-sensor-type-dialog.component';

describe('AddSensorTypeDialogComponent', () => {
  let component: AddSensorTypeDialogComponent;
  let fixture: ComponentFixture<AddSensorTypeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSensorTypeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSensorTypeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
