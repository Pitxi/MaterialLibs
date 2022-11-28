import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FilterSelectorBase } from '../filter-selector-base';
import { distinctUntilChanged, filter, map, startWith, Subject, takeUntil, tap } from 'rxjs';
import { DataFilter } from '../data-filter';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from '../filter-selector-data';
import { ComparisonItem } from '../comparison-item';
import { DataFilterComparison } from '../data-filter-comparison';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';

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
  readonly valueItems                             = this.data.valueListItems ?? [];
  private defaultFilter                           = this.data.defaultFilter ??
    {
      comparison: this.availableComparisons[0].comparison,
      values    : this.data.valueListItems?.map(v => v.value) ?? []
    };
  readonly form                                   = this.fBuilder.group({
                                                                          comparison       : new FormControl<DataFilterComparison>(
                                                                            this.data.filter?.comparison ??
                                                                            this.defaultFilter.comparison,
                                                                            {
                                                                              nonNullable: true,
                                                                              validators : [ Validators.required ]
                                                                            }),
                                                                          valueItemControls: this.fBuilder.array<FormControl<boolean>>(
                                                                            this.data.valueListItems
                                                                                ?.map((item) => new FormControl<boolean>(
                                                                                  (this.data.filter ?? this.defaultFilter).values.includes(item.value) ?? true,
                                                                                  { nonNullable: true }
                                                                                ))
                                                                            ?? []
                                                                          )
                                                                        });
  readonly actionsData$                           = this.form.valueChanges
                                                        .pipe(
                                                          startWith(this.form.value),
                                                          filter(value => value.valueItemControls!.length > 0),
                                                          map(value => ({
                                                            selectAll      : {
                                                              tooltipText: this.intl.selectAll,
                                                              disabled   : value.valueItemControls?.every(isChecked => isChecked)
                                                            },
                                                            selectNone     : {
                                                              tooltipText: this.intl.selectNone,
                                                              disabled   : value.valueItemControls?.every(isChecked => !isChecked)
                                                            },
                                                            toggleSelection: {
                                                              tooltipText: this.intl.toggleSelection,
                                                              disabled   : value.valueItemControls?.every(isChecked => isChecked) ||
                                                                value.valueItemControls?.every(isChecked => !isChecked)
                                                            }
                                                          })),
                                                          tap(console.log)
                                                        );
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

  toggleSelection(): void {
    const controls = this.form.get('valueItemControls') as FormArray;

    for (let index = 0; index < controls.length; ++index) {
      const control = controls.get(String(index));

      control?.setValue(!control?.value);
    }

    controls.updateValueAndValidity();
  }

  selectAll(): void {
    const controls = this.form.get('valueItemControls') as FormArray;

    controls.setValue(Array(controls.length).fill(true));
    controls.updateValueAndValidity();
  }

  selectNone(): void {
    const controls = this.form.get('valueItemControls') as FormArray;

    controls.setValue(Array(controls.length).fill(false));
    controls.updateValueAndValidity();
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();

    this.form.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.unsubscribeControls!),
          map(value => {
            const values = this.valueItems.filter((item, index) => !!value.valueItemControls![index]).map(item => item.value);

            if (value.comparison === this.defaultFilter.comparison &&
              values.length === this.defaultFilter.values.length &&
              values.every(v => this.defaultFilter.values.includes(v))) {
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
