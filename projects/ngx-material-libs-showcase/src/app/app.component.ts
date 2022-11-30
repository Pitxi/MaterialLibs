import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  Subject,
  switchMap
} from 'rxjs';
import { DataService } from './data.service';
import { Person } from './person';
import { DataFilter, MatDataFilterDirective, ValueListItem } from '../../../pitxi/ngx-mat-data-filter/src/lib';
import { PageEvent } from '@angular/material/paginator';

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
             selector       : 'app-root',
             templateUrl    : './app.component.html',
             styleUrls      : [ './app.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent implements OnInit, OnDestroy {
  @ViewChildren(MatDataFilterDirective) filterComponents!: QueryList<MatDataFilterDirective>;
  private filtersForm: FormGroup = this.fBuilder.group({
                                                         id       : new FormControl<DataFilter | null>(null),
                                                         firstName: new FormControl<DataFilter | null>(null),
                                                         lastName : new FormControl<DataFilter | null>(null),
                                                         email    : new FormControl<DataFilter | null>(null),
                                                         gender   : new FormControl<DataFilter | null>(null),
                                                         ipAddress: new FormControl<DataFilter | null>(null),
                                                         jobTitle : new FormControl<DataFilter | null>(null),
                                                         birthDate: new FormControl<DataFilter | null>(null)
                                                       });
  private hasFilters$            = this.filtersForm.valueChanges
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
  private unsubscribe                           = new Subject<void>();
  private paginationData                        = new BehaviorSubject<{ pageIndex: number; pageSize: number; }>({
                                                                                                                  pageIndex: 0,
                                                                                                                  pageSize : 25
                                                                                                                });
  private paginatedDataSource$                  = combineLatest([
                                                                  this.filtersForm.valueChanges.pipe(startWith({})),
                                                                  this.paginationData.asObservable()
                                                                ])
    .pipe(
      switchMap(([ filters, { pageIndex, pageSize } ]) => this.data.getData(filters, pageIndex, pageSize))
    );

  readonly mv$: Observable<ModelView> = combineLatest([
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

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  resetFilters() {
    this.filtersForm.reset();
  }

  setPage(event: PageEvent) {
    this.paginationData.next({ pageSize: event.pageSize, pageIndex: event.pageIndex });
  }
}
