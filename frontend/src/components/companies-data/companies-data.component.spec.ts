import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompaniesDataComponent } from './companies-data.component';

describe('CompaniesDataComponent', () => {
  let component: CompaniesDataComponent;
  let fixture: ComponentFixture<CompaniesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompaniesDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompaniesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
