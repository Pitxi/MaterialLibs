import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FILTER_SELECTOR_DATA } from '@pitxi/ngx-cdk-data-filter';

describe('MatNumberFilterSelectorComponent', () => {
  let component: MatNumberFilterSelectorComponent;
  let fixture: ComponentFixture<MatNumberFilterSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             BrowserAnimationsModule,
                                             ReactiveFormsModule,
                                             MatInputModule,
                                             MatSelectModule,
                                             MatCardModule
                                           ],
                                           declarations: [ MatNumberFilterSelectorComponent ],
                                           providers   : [
                                             {
                                               provide : FILTER_SELECTOR_DATA,
                                               useValue: { filter: null }
                                             }
                                           ]
                                         })
                 .compileComponents();

    fixture   = TestBed.createComponent(MatNumberFilterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
