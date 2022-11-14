import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDateFilterSelectorComponent } from './mat-date-filter-selector.component';

describe('MatDateFilterSelectorComponent', () => {
  let component: MatDateFilterSelectorComponent;
  let fixture: ComponentFixture<MatDateFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatDateFilterSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatDateFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
