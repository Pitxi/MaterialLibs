import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, map, Observable, Subject, takeUntil } from 'rxjs';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxMatDataFilterConfiguration } from '../ngx-mat-data-filter-configuration';
import { DataFilter, FILTER_SELECTOR_DATA, FilterSelectorBase, FilterSelectorData } from '@pitxi/ngx-cdk-data-filter';
import { FilterComparison } from '../FilterComparison';

@Component({
             selector       : 'ngx-mat-string-filter-selector',
             templateUrl    : './mat-string-filter-selector.component.html',
             styleUrls      : [ './mat-string-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatStringFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  comparisons                                            = new Map<FilterComparison, string>([
                                                                                               [ 'equal-to', this.intl.getComparisonText('equal-to') ],
                                                                                               [ 'not-equal-to', this.intl.getComparisonText('not-equal-to') ],
                                                                                               [ 'contains', this.intl.getComparisonText('contains') ],
                                                                                               [ 'not-contains', this.intl.getComparisonText('not-contains') ]
                                                                                             ]);
  readonly placeholder                                   = this.intl.stringFilterPlaceholder;
  readonly clearControlIcon                              = this.config.icons.clearControl;
  private defaultFilter: DataFilter                      = this.data.defaultFilter ??
    {
      comparisonName: 'equal-to',
      values        : [ null ]
    };
  readonly form                                          = this.fBuilder.group({
                                                                                 comparisonName: new FormControl<string>(
                                                                                   this.data.filter?.comparisonName ??
                                                                                   this.defaultFilter.comparisonName,
                                                                                   {
                                                                                     nonNullable: true,
                                                                                     validators : [ Validators.required ]
                                                                                   }),
                                                                                 text          : new FormControl<string | null>(
                                                                                   this.data.filter?.values[0] ??
                                                                                   this.defaultFilter.values[0]
                                                                                 )
                                                                               });
  private filterChangedSubject                           = new Subject<DataFilter | null>();
  readonly filterChanged$: Observable<DataFilter | null> = this.filterChangedSubject.asObservable();
  private unsubscribeControls: Subject<void> | undefined;

  constructor(@Inject(FILTER_SELECTOR_DATA) protected data: FilterSelectorData,
              private intl: NgxMatDataFilterIntl,
              private config: NgxMatDataFilterConfiguration,
              private fBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unsubscribeFormControls();
  }

  clearControl(): void {
    this.form.get('text')?.reset();
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls),
          map(value => {
            if (value.comparisonName === this.defaultFilter.comparisonName &&
              value.text == this.defaultFilter.values[0]) {
              return null;
            }

            return { comparisonName: value.comparisonName, values: !!value.text ? [ value.text ] : [] } as DataFilter;
          })
        )
        .subscribe(filter => this.filterChangedSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }
}
