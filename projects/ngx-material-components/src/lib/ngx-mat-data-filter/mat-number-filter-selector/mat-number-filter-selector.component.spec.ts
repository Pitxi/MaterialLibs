import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector.component';

describe('MatNumberFilterSelectorComponent', () => {
  let component: MatNumberFilterSelectorComponent;
  let fixture: ComponentFixture<MatNumberFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatNumberFilterSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatNumberFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
