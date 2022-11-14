import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { distinctUntilChanged, map, Subject, takeUntil } from 'rxjs';
import { DataFilter } from '../data-filter';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';
import { ComparisonItem } from '../comparison-item';
import { DataFilterComparison } from '../data-filter-comparison';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
             selector       : 'ngx-mat-value-list-filter-selector',
             templateUrl    : './mat-value-list-filter-selector.component.html',
             styleUrls      : [ './mat-value-list-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatValueListFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly availableComparisons: ComparisonItem[] = [
    this.intl.getComparisonItem(DataFilterComparison.IsOneOf),
    this.intl.getComparisonItem(DataFilterComparison.IsNotOneOf)
  ];
  readonly form                                   = this.fBuilder.group({
                                                                          comparison       : new FormControl(
                                                                            this.data.filter?.comparison ?? this.availableComparisons[0].comparison,
                                                                            {
                                                                              nonNullable: true,
                                                                              validators : [ Validators.required ]
                                                                            }),
                                                                          valueItemControls: this.fBuilder.array<FormControl<boolean>>(
                                                                            this.data.valueListItems
                                                                                ?.map((item) => new FormControl<boolean>(
                                                                                  this.data.filter?.values.includes(item.value) ?? true,
                                                                                  { nonNullable: true }
                                                                                ))
                                                                            ?? []
                                                                          )
                                                                        });
  readonly valueItems                             = this.data.valueListItems ?? [];
  private filterChangeSubject                     = new Subject<DataFilter | null>();
  readonly filterChanged$                         = this.filterChangeSubject.asObservable();
  private unsubscribeValueItems: Subject<void> | undefined;

  constructor(@Inject(FILTER_SELECTOR_DATA) private data: FilterSelectorData,
              private intl: NgxMatDataFilterIntl,
              private fBuilder: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unSubscribeValueItems();
    this.unsubscribeFormControls();
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls!),
          map(value => {
            const values = this.valueItems.filter((item, index) => value.valueItemControls![index]).map(item => item.value);

            if (values.length === this.valueItems.length) {
              return null;
            }

            return {
              comparison: value.comparison,
              values
            } as DataFilter;
          })
        )
        .subscribe(filter => this.filterChangeSubject.next(filter));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private unSubscribeValueItems(): void {
    this.unsubscribeValueItems?.next();
    this.unsubscribeValueItems?.complete();
  }
}
