import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatStringFilterSelectorComponent } from './mat-string-filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FILTER_SELECTOR_DATA } from '../filter-selector-data';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

describe('MatStringFilterSelectorComponent', () => {
  let component: MatStringFilterSelectorComponent;
  let fixture: ComponentFixture<MatStringFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             BrowserAnimationsModule,
                                             ReactiveFormsModule,
                                             MatInputModule,
                                             MatSelectModule,
                                             MatCardModule
                                           ],
                                           declarations: [ MatStringFilterSelectorComponent ],
                                           providers   : [
                                             {
                                               provide : FILTER_SELECTOR_DATA,
                                               useValue: { filter: null }
                                             }
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(MatStringFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
