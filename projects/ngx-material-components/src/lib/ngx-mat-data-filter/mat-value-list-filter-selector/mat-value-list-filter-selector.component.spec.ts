import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector.component';

describe('MatValueListDataFilterComponent', () => {
  let component: MatValueListFilterSelectorComponent;
  let fixture: ComponentFixture<MatValueListFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatValueListFilterSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatValueListFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
