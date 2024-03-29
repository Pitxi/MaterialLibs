import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Subject, takeUntil, tap } from 'rxjs';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { NgxMatDataFilterConfiguration } from '../ngx-mat-data-filter-configuration';
import { DataFilter, FILTER_SELECTOR_DATA, FilterSelectorBase, FilterSelectorData } from '@pitxi/ngx-cdk-data-filter';
import { FilterComparison } from '../FilterComparison';
import { FiltersHelper } from '../filters-helper';

@Component({
             selector       : 'ngx-mat-number-filter-selector',
             templateUrl    : './mat-number-filter-selector.component.html',
             styleUrls      : [ './mat-number-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatNumberFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly comparisons                    = new Map<FilterComparison, string>([
                                                                                [ 'equals', this.intl.getComparisonText('equals') ],
                                                                                [ 'not-equal', this.intl.getComparisonText('not-equal') ],
                                                                                [ 'greater-than', this.intl.getComparisonText('greater-than') ],
                                                                                [ 'less-than', this.intl.getComparisonText('less-than') ],
                                                                                [ 'is-in-range', this.intl.getComparisonText('is-in-range') ]
                                                                              ]);
  readonly clearControlIcon               = this.config.icons.clearControl;
  protected readonly inputReadonly        = this.data.inputReadonly;
  protected readonly minValueErrorMessage = this.intl.minValueErrorMessage;
  protected readonly maxValueErrorMessage = this.intl.maxValueErrorMessage;
  private defaultFilter: DataFilter       = this.data.defaultFilter ??
    {
      comparisonName: 'equals',
      values        : [ null, null ]
    };
  readonly form                           = this.fBuilder.group(
    {
      comparisonName: new FormControl<string>(
        this.data.filter?.comparisonName ??
        this.defaultFilter.comparisonName,
        {
          nonNullable: true,
          validators : [ Validators.required ]
        }
      ),
      number1       : new FormControl<number | null>(this.data.filter?.values[0] ?? this.defaultFilter.values[0]),
      number2       : new FormControl<number | null>(this.data.filter?.values[1] ?? this.defaultFilter.values[1])
    }
  );
  readonly filterIsValid$                 = this.form.statusChanges.pipe(map(status => status === 'VALID'));
  private placeholdersSubject             = new BehaviorSubject<Array<string>>(
    this.intl.getNumberFiltersPlaceholders(this.form.value.comparisonName as FilterComparison)
  );
  readonly placeHolders$                  = this.placeholdersSubject.asObservable();
  private filterChangedSubject            = new Subject<DataFilter | null>;
  readonly filterChanged$                 = this.filterChangedSubject.asObservable();
  private unsubscribeControls: Subject<void> | undefined;

  constructor(private fBuilder: FormBuilder,
              private intl: NgxMatDataFilterIntl,
              private config: NgxMatDataFilterConfiguration,
              @Inject(FILTER_SELECTOR_DATA) protected data: FilterSelectorData) {
    super();
  }

  clearControl(controlName: string): void {
    this.form.get(controlName)?.reset();
  }

  ngOnInit(): void {
    if (typeof this.data.minValue === 'number') {
      this.form.get('number1')?.addValidators(Validators.min(this.data.minValue));
      this.form.get('number2')?.addValidators(Validators.min(this.data.minValue));
    }

    if (typeof this.data.maxValue === 'number') {
      this.form.get('number1')?.addValidators(Validators.max(this.data.maxValue));
      this.form.get('number2')?.addValidators(Validators.max(this.data.maxValue));
    }

    this.subscribeFormControls();
  }

  ngOnDestroy(): void {
    this.unsubscribeFormControls();
  }

  protected subscribeFormControls(): void {
    this.unsubscribeControls = new Subject<void>();
    this.data.inputMask      = this.data.inputMask ?? /^-?$|^[+-]?\d+$|^[+-]?\d+\.\d*$/;

    FiltersHelper.SetControlsPatternValidation([
                                                 this.form.get('number1')!,
                                                 this.form.get('number2')!
                                               ],
                                               this.data.inputMask,
                                               this.unsubscribeControls);

    this.form.valueChanges
        .pipe(
          takeUntil(this.unsubscribeControls),
          distinctUntilChanged(),
          tap(({ comparisonName }) => this.placeholdersSubject.next(
            this.intl.getNumberFiltersPlaceholders(comparisonName as FilterComparison))
          ),
          map(value => this.getFilter(value))
        )
        .subscribe(filter => this.filterChangedSubject.next(this.form.valid ? filter : null));
  }

  protected unsubscribeFormControls(): void {
    this.unsubscribeControls?.next();
    this.unsubscribeControls?.complete();
  }

  private getFilter(value: Partial<{ comparisonName: string; number1: number | null; number2: number | null; }>)
    : DataFilter | null {

    if (value.comparisonName === this.defaultFilter.comparisonName &&
      value.number1 == this.defaultFilter.values[0] &&
      value.number2 == this.defaultFilter.values[1]
    ) {
      return null;
    }

    const values = new Array<number>();

    if (value.number1 != null) {
      values.push(Number(value.number1));

      if (value.number2 != null) {
        values.push(Number(value.number2));
      }
    }

    return {
      comparisonName: value.comparisonName ?? this.defaultFilter.comparisonName,
      values
    };
  }
}
