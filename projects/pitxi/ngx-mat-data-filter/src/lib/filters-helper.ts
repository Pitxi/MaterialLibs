import { AbstractControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  startWith,
  Subject,
  takeLast,
  takeUntil,
  tap
} from 'rxjs';
import { FilterInputMask } from '@pitxi/ngx-cdk-data-filter';

export class FiltersHelper {
  static SetControlPatternValidation(control: AbstractControl, mask: FilterInputMask | null, unsubscriber: Subject<void>): void {
    if (mask instanceof RegExp) {
      control.valueChanges
             .pipe(
               takeUntil(unsubscriber),
               startWith(null),
               distinctUntilChanged(),
               pairwise(),
               filter(([ , newValue ]) => !!newValue),
               map(([ oldValue, newValue ]) => mask.test(newValue) ? newValue : mask.test(oldValue) ? oldValue : null),
             ).subscribe(value => control.setValue(value));
    }

    if (Array.isArray(mask)) {
      control.valueChanges
             .pipe(
               takeUntil(unsubscriber),
               distinctUntilChanged(),
               map(value => {
                 if (!mask || !value) {
                   return value;
                 }

                 const text = value.toString() as string;

                 return [ ...text ].reduce((previousValue, currentValue, currentIndex) => {
                   const currentMask = mask[currentIndex];
                   const maskText    = typeof currentMask === 'string' ? currentMask : null;
                   const maskRegExp  = currentMask instanceof RegExp ? currentMask as RegExp : null;

                   if (currentValue !== maskText && !maskRegExp?.test(currentValue)) {
                     return previousValue;
                   }

                   return previousValue + currentValue;
                 }, '');
               })
             ).subscribe(value => control.setValue(value));
    }
  }

  static SetControlsPatternValidation(controls: Array<AbstractControl>, mask: FilterInputMask | null, unsubscriber: Subject<void>): void {
    controls.forEach(control => FiltersHelper.SetControlPatternValidation(control, mask, unsubscriber));
  }
}
