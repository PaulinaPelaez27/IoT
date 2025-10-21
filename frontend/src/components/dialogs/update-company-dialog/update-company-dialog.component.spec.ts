import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompanyDialogComponent } from './update-company-dialog.component';

describe('UpdateCompanyDialogComponent', () => {
  let component: UpdateCompanyDialogComponent;
  let fixture: ComponentFixture<UpdateCompanyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCompanyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
