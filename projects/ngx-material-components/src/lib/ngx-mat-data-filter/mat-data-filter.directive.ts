import { Directive, ElementRef, forwardRef, HostListener, Injector, Input, OnDestroy, Type } from '@angular/core';
import { DataFilterType } from './data-filter-type';
import { DataFilter } from './data-filter';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ValueListItem } from './value-list-item';
import { merge, Subject, takeUntil } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { FilterSelectorBase } from './filter-selector-base';
import { MatValueListFilterSelectorComponent } from './mat-value-list-filter-selector';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from './filter-selector-data';
import { MatStringFilterSelectorComponent } from './mat-string-filter-selector';
import { MatNumberFilterSelectorComponent } from './mat-number-filter-selector';
import { DataFilterHelper } from './data-filter-helper';
import { MatDateFilterSelectorComponent } from './mat-date-filter-selector/mat-date-filter-selector.component';
import { DataFilterComparison } from './data-filter-comparison';

@Directive({
             selector : '[ngxMatDataFilter]',
             exportAs : 'ngxMatDataFilter',
             providers: [
               {
                 provide    : NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => MatDataFilterDirective),
                 multi      : true
               }
             ]
           })
export class MatDataFilterDirective implements OnDestroy, ControlValueAccessor {
  @Input() valueListItems: ValueListItem[] = [];
  @Input('ngxMatDataFilter') filterType!: DataFilterType;
  @Input() defaultFilter: DataFilter | undefined;

  private isDropdownOpen                   = false;
  private dataFilter: DataFilter | null    = null;
  private oldDatafilter: DataFilter | null = null;
  private isDisabled                       = false;
  private overlayRef                       = this.createMatDataFilterOverlay();
  private dropdownClosingActions$          = merge(this.overlayRef.backdropClick(), this.overlayRef.detachments());
  private dropdownUnsubscriber: Subject<void> | undefined;

  constructor(private overlay: Overlay, private elementRef: ElementRef) {
  }

  get filterIsEmpty(): boolean {
    switch (this.dataFilter?.comparison) {
      case DataFilterComparison.EqualTo:
      case DataFilterComparison.NotEqualTo:
      case DataFilterComparison.Contains:
      case DataFilterComparison.NotContains:
      case DataFilterComparison.GreaterThan:
      case DataFilterComparison.LesserThan:
        return this.dataFilter.values.length === 0;
      case DataFilterComparison.IsOneOf:
        return this.dataFilter.values.length === this.valueListItems.length;
      case DataFilterComparison.IsNotOneOf:
        return this.dataFilter.values.length === 0;
      case DataFilterComparison.IsInRange:
        return this.dataFilter.values.length < 2;
    }

    return !this.dataFilter;
  }

  ngOnDestroy(): void {
    this.closeDropdown();
  }

  registerOnChange(fn: any): void {
    this.propagateChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = true;
  }

  writeValue(dataFilter: DataFilter | null): void {
    this.oldDatafilter = dataFilter;
    this.dataFilter    = dataFilter;
  }

  @HostListener('click')
  private openDropdown(): void {
    let componentType: Type<FilterSelectorBase>;

    const data: FilterSelectorData = { defaultFilter: this.defaultFilter, filter: this.dataFilter ?? null };
    this.isDropdownOpen            = true;
    this.dropdownUnsubscriber      = new Subject<void>();

    switch (this.filterType) {
      case 'string':
        componentType = MatStringFilterSelectorComponent;
        break;
      case 'number':
        componentType = MatNumberFilterSelectorComponent;
        break;
      case 'date':
        componentType = MatDateFilterSelectorComponent;
        break;
      case 'value-list':
        componentType       = MatValueListFilterSelectorComponent;
        data.valueListItems = this.valueListItems;

        break;
    }

    const injector     = Injector.create({ providers: [ { provide: FILTER_SELECTOR_DATA, useValue: data } ] });
    const portal       = new ComponentPortal<FilterSelectorBase>(componentType, null, injector);
    const componentRef = this.overlayRef.attach(portal);

    componentRef?.instance.filterChanged$
                .pipe(takeUntil(this.dropdownUnsubscriber))
                .subscribe(filter => {
                  this.dataFilter = filter;

                  this.propagateTouched();
                });

    this.dropdownClosingActions$
        .pipe(takeUntil(this.dropdownUnsubscriber))
        .subscribe(() => this.closeDropdown());
  }

  private propagateChanged = (_: DataFilter | null | undefined): void => {
  };

  private propagateTouched = (): void => {
  };

  private createMatDataFilterOverlay(): OverlayRef {
    return this.overlay.create({
                                 hasBackdrop     : true,
                                 backdropClass   : 'cdk-overlay-transparent-backdrop',
                                 scrollStrategy  : this.overlay.scrollStrategies.close(),
                                 positionStrategy: this.overlay
                                                       .position()
                                                       .flexibleConnectedTo(this.elementRef)
                                                       .withPositions([
                                                                        {
                                                                          originX : 'start',
                                                                          originY : 'bottom',
                                                                          overlayX: 'start',
                                                                          overlayY: 'top',
                                                                          offsetY : 8
                                                                        }
                                                                      ])
                               });
  }

  private closeDropdown(): void {
    if (!this.isDropdownOpen) {
      return;
    }

    if (!DataFilterHelper.compare(this.dataFilter, this.oldDatafilter)) {
      this.oldDatafilter = this.dataFilter;

      this.propagateChanged(this.dataFilter);
    }

    this.dropdownUnsubscriber?.next();
    this.dropdownUnsubscriber?.complete();
    this.overlayRef.detach();

    this.isDropdownOpen = false;
  }
}
