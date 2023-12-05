import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map, Observable, startWith, Subject, takeUntil } from 'rxjs';
import { NgxMatDataFilterIntl } from '../ngx-mat-data-filter-intl';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxMatDataFilterConfiguration } from '../ngx-mat-data-filter-configuration';
import { FilterComparison } from '../FilterComparison';
import {
  DataFilter,
  FILTER_SELECTOR_DATA,
  FilterSelectorBase,
  FilterSelectorData,
  ValueListItem
} from '@pitxi/ngx-cdk-data-filter';

interface ActionData {
  tooltipText: string;
  text: string;
  icon?: string;
  disabled: boolean;
}

interface ActionsData {
  selectAll: ActionData;
  selectNone: ActionData;
  toggleSelection: ActionData;
}

interface ModelView {
  form: FormGroup;
  comparisons: Map<FilterComparison, string>;
  valueItems: Array<ValueListItem>;
  showActions: boolean;
  actionsData: ActionsData;
}

@Component({
             selector       : 'ngx-mat-value-list-filter-selector',
             templateUrl    : './mat-value-list-filter-selector.component.html',
             styleUrls      : [ './mat-value-list-filter-selector.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class MatValueListFilterSelectorComponent
  extends FilterSelectorBase
  implements OnInit, OnDestroy {
  readonly comparisons                          = new Map<FilterComparison, string>([
                                                                                      [ 'is-one-of', this.intl.getComparisonText('is-one-of') ],
                                                                                      [ 'is-not-one-of', this.intl.getComparisonText('is-not-one-of') ]
                                                                                    ]);
  private valueItems                            = this.data.valueListItems ?? new Array<ValueListItem>();
  private readonly defaultFilter                = this.data.defaultFilter ??
    {
      comparisonName: 'is-one-of',
      values        : this.data.valueListItems?.map(v => v.value) ?? new Array<ValueListItem>()
    };
  protected readonly form                       = this.fBuilder.group({
                                                                        comparisonName   : new FormControl<string>(
                                                                          this.data.filter?.comparisonName ??
                                                                          this.defaultFilter.comparisonName,
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
                                                                          ?? new Array<FormControl<boolean>>
                                                                        )
                                                                      });
  protected readonly mv$: Observable<ModelView> = this.form.valueChanges
                                                      .pipe(
                                                        startWith(this.form.value),
                                                        filter(value => value.valueItemControls!.length > 0),
                                                        map(value => ({
                                                          selectAll      : {
                                                            tooltipText: this.intl.selectAll,
                                                            text       : this.intl.all,
                                                            icon       : this.config.icons.selectAll,
                                                            disabled   : value.valueItemControls?.every(isChecked => isChecked)
                                                          },
                                                          selectNone     : {
                                                            tooltipText: this.intl.selectNone,
                                                            text       : this.intl.none,
                                                            icon       : this.config.icons.selectNone,
                                                            disabled   : value.valueItemControls?.every(isChecked => !isChecked)
                                                          },
                                                          toggleSelection: {
                                                            tooltipText: this.intl.toggleSelection,
                                                            text       : this.intl.toggle,
                                                            icon       : this.config.icons.toggleSelection,
                                                            disabled   : value.valueItemControls?.every(isChecked => isChecked) ||
                                                              value.valueItemControls?.every(isChecked => !isChecked)
                                                          }
                                                        } as ActionsData)),
                                                        map(actionsData => ({
                                                          form       : this.form,
                                                          valueItems : this.valueItems,
                                                          comparisons: this.comparisons,
                                                          showActions: this.config.showActions['value-list'] ?? false,
                                                          actionsData
                                                        }))
                                                      );
  readonly filterIsValid$                       = this.form.statusChanges.pipe(map(status => status === 'VALID'));
  private readonly filterChangeSubject          = new Subject<DataFilter | null>();
  readonly filterChanged$                       = this.filterChangeSubject.asObservable();
  private readonly unsubscribeValueItems: Subject<void> | undefined;
  private unsubscribeControls: Subject<void> | undefined;

  constructor(@Inject(FILTER_SELECTOR_DATA) protected data: FilterSelectorData,
              private config: NgxMatDataFilterConfiguration,
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
          filter(() => this.form.valid),
          takeUntil(this.unsubscribeControls!),
          distinctUntilChanged(),
          map(value => {
            const values = this.valueItems.filter((_, index) => !!value.valueItemControls![index]).map(item => item.value);

            if (value.comparisonName === this.defaultFilter.comparisonName &&
              values.length === this.defaultFilter.values.length &&
              values.every(v => this.defaultFilter.values.includes(v))) {
              return null;
            }

            return {
              comparisonName: value.comparisonName,
              values
            } as DataFilter;
          })
        )
        .subscribe(filter => this.filterChangeSubject.next(this.form.valid ? filter : null));
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
