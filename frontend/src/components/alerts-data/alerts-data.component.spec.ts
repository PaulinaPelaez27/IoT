import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsDataComponent } from './alerts-data.component';

describe('AlertsDataComponent', () => {
  let component: AlertsDataComponent;
  let fixture: ComponentFixture<AlertsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
