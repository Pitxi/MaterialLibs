import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDateFilterSelectorComponent } from './mat-date-filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FILTER_SELECTOR_DATA } from '../filter-selector-data';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';

describe('MatDateFilterSelectorComponent', () => {
  let component: MatDateFilterSelectorComponent;
  let fixture: ComponentFixture<MatDateFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             BrowserAnimationsModule,
                                             ReactiveFormsModule,
                                             MatInputModule,
                                             MatSelectModule,
                                             MatDatepickerModule,
                                             MatNativeDateModule,
                                             MatCardModule
                                           ],
                                           declarations: [ MatDateFilterSelectorComponent ],
                                           providers   : [
                                             {
                                               provide : FILTER_SELECTOR_DATA,
                                               useValue: { filter: null }
                                             }
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(MatDateFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
