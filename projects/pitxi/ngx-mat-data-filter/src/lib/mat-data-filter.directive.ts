import { Directive, ElementRef, forwardRef, Input, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Overlay } from '@angular/cdk/overlay';
import { MatButton } from '@angular/material/button';
import { NgxMatDataFilterConfiguration } from './ngx-mat-data-filter-configuration';
import { CdkDataFilterDirective, DataFilterRegistry } from '@pitxi/ngx-cdk-data-filter';

@Directive({
             selector : '[ngxMatDataFilter]',
             exportAs : 'ngxMatDataFilter',
             providers: [
               {
                 provide    : NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => MatDataFilterDirective),
                 multi      : true
               }
             ],
             host     : {
               '[class.mat-button-disabled]': 'disabled && isMatButton'
             }
           })
export class MatDataFilterDirective extends CdkDataFilterDirective {
  @Input('ngxMatDataFilter') override filterType!: string;

  constructor(registry: DataFilterRegistry,
              overlay: Overlay,
              elementRef: ElementRef,
              private config: NgxMatDataFilterConfiguration,
              @Optional() private matButton: MatButton) {
    super(registry, overlay, elementRef);
    this.backdropClass = this.config.backdropClass;
  }

  override get disabled(): boolean {
    return super.disabled;
  }

  get isMatButton(): boolean {
    return !!this.matButton;
  }

  get filterIsEmpty(): boolean {
    switch (this.filterType) {
      case 'string':
        return !this.dataFilter?.values[0];
      case 'date':
        return !this.dataFilter ||
          this.dataFilter.values[0] == null ||
          (this.dataFilter.comparisonName === 'is-in-range' && this.dataFilter.values[1] == null);
      case 'number':
        return !this.dataFilter ||
          this.dataFilter.values[0] == null ||
          (this.dataFilter.comparisonName === 'is-in-range' && this.dataFilter.values[1] == null);
      case 'value-list':
        const allValues = this.valueListItems.map(i => i.value);

        return !this.dataFilter ||
          (
            this.dataFilter?.comparisonName === 'is-one-of' &&
            this.dataFilter.values.every(v => allValues.includes(v)) &&
            this.dataFilter.values.length === allValues.length
          ) ||
          (this.dataFilter?.comparisonName === 'is-not-one-of' && this.dataFilter.values.length === 0);
    }

    return true;
  }
}
