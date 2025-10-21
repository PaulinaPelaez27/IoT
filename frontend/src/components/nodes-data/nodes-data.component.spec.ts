import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodesDataComponent } from './nodes-data.component';

describe('NodesDataComponent', () => {
  let component: NodesDataComponent;
  let fixture: ComponentFixture<NodesDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodesDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodesDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
