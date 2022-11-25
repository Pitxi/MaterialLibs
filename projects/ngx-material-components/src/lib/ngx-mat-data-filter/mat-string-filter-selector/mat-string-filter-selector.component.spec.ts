import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatStringFilterSelectorComponent } from './mat-string-filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FILTER_SELECTOR_DATA } from '../filter-selector-data';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

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
