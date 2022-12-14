import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FILTER_SELECTOR_DATA } from '../filter-selector-data';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

describe('MatValueListDataFilterComponent', () => {
  let component: MatValueListFilterSelectorComponent;
  let fixture: ComponentFixture<MatValueListFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             BrowserAnimationsModule,
                                             ReactiveFormsModule,
                                             MatSelectModule,
                                             MatCheckboxModule,
                                             MatCardModule
                                           ],
                                           declarations: [ MatValueListFilterSelectorComponent ],
                                           providers   : [
                                             {
                                               provide : FILTER_SELECTOR_DATA,
                                               useValue: {
                                                 filter        : null,
                                                 valueListItems: [
                                                   { description: 'Option 1', value: 1 },
                                                   { description: 'Option 2', value: 2 },
                                                   { description: 'Option 3', value: 3 }
                                                 ]
                                               }
                                             }
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(MatValueListFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
