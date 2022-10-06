import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatStringFilterSelectorComponent } from './mat-string-filter-selector.component';

describe('MatStringFilterSelectorComponent', () => {
  let component: MatStringFilterSelectorComponent;
  let fixture: ComponentFixture<MatStringFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatStringFilterSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatStringFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
