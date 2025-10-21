import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCompanyDialogComponent } from './create-company-dialog.component';

describe('CreateCompanyDialogComponent', () => {
  let component: CreateCompanyDialogComponent;
  let fixture: ComponentFixture<CreateCompanyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCompanyDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCompanyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
