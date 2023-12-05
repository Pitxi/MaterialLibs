import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, Observable, startWith, switchMap, tap } from 'rxjs';
import { DataService } from './data.service';
import { PageEvent } from '@angular/material/paginator';
import { Person } from './person';
import { DataFilter, MatDataFilterDirective, ValueListItem } from '../../../../pitxi/ngx-mat-data-filter/src/lib';

interface ModelView {
  filtersForm: FormGroup;
  genderValueListItems: ValueListItem[];
  displayedColumns: string[];
  dataSource: Person[];
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  hasFilters: boolean;
}

@Component({
             selector   : 'app-data-filter-showcase',
             templateUrl: './data-filter-showcase.component.html',
             styleUrls  : [ './data-filter-showcase.component.scss' ]
           })
export class DataFilterShowcaseComponent {
  @ViewChildren(MatDataFilterDirective) filterComponents!: QueryList<MatDataFilterDirective>;
  protected readonly emailRegexp = /^[a-zA-Z\d_.-]+$|^[a-zA-Z\d_.-]+@?[A-z\d_.-]*$/;
  private filtersForm: FormGroup                = this.fBuilder.group({
                                                                        id       : new FormControl<DataFilter | null>(null),
                                                                        firstName: new FormControl<DataFilter | null>(null),
                                                                        lastName : new FormControl<DataFilter | null>(null),
                                                                        email    : new FormControl<DataFilter | null>(null),
                                                                        gender   : new FormControl<DataFilter | null>(null),
                                                                        ipAddress: new FormControl<DataFilter | null>(null),
                                                                        jobTitle : new FormControl<DataFilter | null>(null),
                                                                        birthDate: new FormControl<DataFilter | null>(null)
                                                                      });
  private hasFilters$                           = this.filtersForm.valueChanges
                                                      .pipe(
                                                        startWith(false),
                                                        distinctUntilChanged(),
                                                        map(_ => this.filterComponents?.some(fc => !fc.filterIsEmpty))
                                                      );
  private genderValueListItems: ValueListItem[] = [
    { value: 'Male', description: 'Male' },
    { value: 'Female', description: 'Female' },
    { value: 'Polygender', description: 'Polygender' },
    { value: 'Genderqueer', description: 'Genderqueer' },
    { value: 'Bigender', description: 'Bigender' },
    { value: 'Genderfluid', description: 'Genderfluid' },
    { value: 'Agender', description: 'Agender' },
    { value: 'Non-binary', description: 'Non-binary' }
  ];
  private displayedColumns                      = [
    'id',
    'firstName',
    'lastName',
    'email',
    'gender',
    'ipAddress',
    'jobTitle',
    'birthDate'
  ];
  private paginationDataSubject                 = new BehaviorSubject<{ pageIndex: number; pageSize: number; }>(
    {
      pageIndex: 0,
      pageSize : 25
    }
  );
  private paginatedDataSource$                  = combineLatest([
                                                                  this.filtersForm.valueChanges.pipe(
                                                                    startWith(this.filtersForm.value),
                                                                    distinctUntilChanged(),
                                                                    tap(_ => this.paginationDataSubject.next(
                                                                      {
                                                                        pageIndex: 0,
                                                                        pageSize : this.paginationDataSubject
                                                                                       .getValue().pageSize
                                                                      }
                                                                    ))
                                                                  ),
                                                                  this.paginationDataSubject.asObservable()
                                                                ])
    .pipe(
      switchMap(([ filters, { pageIndex, pageSize } ]) => this.data.getData(filters, pageIndex, pageSize))
    );
  protected readonly mv$: Observable<ModelView>           = combineLatest([
                                                                  this.paginatedDataSource$,
                                                                  this.hasFilters$
                                                                ])
    .pipe(
      map(([ paginatedDataSource, hasFilters ]) => ({
        filtersForm         : this.filtersForm,
        genderValueListItems: this.genderValueListItems,
        displayedColumns    : this.displayedColumns,
        dataSource          : paginatedDataSource.data,
        pageIndex           : paginatedDataSource.pageIndex,
        pageSize            : paginatedDataSource.pageSize,
        rowCount            : paginatedDataSource.rowCount,
        hasFilters
      }))
    );

  constructor(private fBuilder: FormBuilder, private data: DataService) {
  }

  protected resetFilters() {
    this.filtersForm.reset();
  }

  protected setPage(event: PageEvent) {
    this.paginationDataSubject.next({ pageSize: event.pageSize, pageIndex: event.pageIndex });
  }
}
