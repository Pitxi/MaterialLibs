import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFilterShowcaseComponent } from './data-filter-showcase.component';

describe('DataFilterShowcaseComponent', () => {
  let component: DataFilterShowcaseComponent;
  let fixture: ComponentFixture<DataFilterShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataFilterShowcaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataFilterShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
