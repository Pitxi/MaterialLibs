import { MatDataFilterDirective } from './mat-data-filter.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DataFilter } from './data-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector';
import { MatStringFilterSelectorComponent } from './mat-string-filter-selector';
import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector';
import { MatDateFilterSelectorComponent } from './mat-date-filter-selector';
import { NGX_MAT_DATA_FILTER_INTL_PROVIDER } from './ngx-mat-data-filter-intl';
import { Overlay } from '@angular/cdk/overlay';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';

@Component({
             template: `
               <button mat-flat-button ngxMatDataFilter="string" [(ngModel)]="filter">Test</button>`
           })
class HostComponent {
  filter: DataFilter | null = null;
}

describe('MatDataFilterDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let button: HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
                                           imports     : [
                                             FormsModule,
                                             ReactiveFormsModule,
                                             MatButtonModule,
                                             MatNativeDateModule,
                                             MatCardModule,
                                             MatSelectModule,
                                             MatCheckboxModule,
                                             MatInputModule,
                                             MatDatepickerModule
                                           ],
                                           declarations: [
                                             MatDataFilterDirective,
                                             MatValueListFilterSelectorComponent,
                                             MatStringFilterSelectorComponent,
                                             MatNumberFilterSelectorComponent,
                                             MatDateFilterSelectorComponent,
                                             HostComponent ],
                                           providers   : [ Overlay, NGX_MAT_DATA_FILTER_INTL_PROVIDER ]
                                         }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);

    fixture.detectChanges();

    button = fixture.debugElement.query(By.css('button')).nativeElement;
  });

  it('Should work', () => {

    expect(fixture.componentInstance.filter).toBe(null);
  });
});
