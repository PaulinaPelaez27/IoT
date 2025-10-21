import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSensorsDialogComponent } from './add-sensors-dialog.component';

describe('AddSensorsDialogComponent', () => {
  let component: AddSensorsDialogComponent;
  let fixture: ComponentFixture<AddSensorsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSensorsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSensorsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
