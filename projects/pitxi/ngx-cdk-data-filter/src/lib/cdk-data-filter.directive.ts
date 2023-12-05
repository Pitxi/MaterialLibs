import { Directive, ElementRef, forwardRef, HostListener, Injector, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ValueListItem } from './value-list-item';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { DataFilterRegistry } from './data-filter-registry.service';
import { DataFilter } from './data-filter';
import { combineLatest, merge, Subject, takeUntil } from 'rxjs';
import { FILTER_SELECTOR_DATA, FilterSelectorData } from './filter-selector-data';
import { FilterSelectorBase } from './filter-selector-base';
import { ComponentPortal } from '@angular/cdk/portal';
import { FilterInputMask } from './filter-input-mask';

@Directive({
             selector : '[ngxCdkDataFilter]',
             exportAs : 'ngxCdkDataFilter',
             providers: [
               {
                 provide    : NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => CdkDataFilterDirective),
                 multi      : true
               }
             ],
             host     : {
               '[attr.disabled]': 'disabled || null'
             }
           })
export class CdkDataFilterDirective implements ControlValueAccessor {
  @Input() valueListItems: ValueListItem[]               = [];
  @Input('ngxCdkDataFilter') filterType!: string;
  @Input() defaultFilter: DataFilter | undefined;
  protected _inputMask: FilterInputMask | null           = null;
  protected _inputReadonly: boolean                      = false;
  protected backdropClass: string | string[] | undefined = 'cdk-overlay-transparent-backdrop';
  protected dataFilter: DataFilter | null                = null;
  protected oldDataFilter: DataFilter | null             = null;
  protected isDisabled                                   = false;
  protected overlayRef                                   = this.createOverlayRef();
  protected isOverlayVisible                             = false;
  protected overlayClosingActions$                       = merge(this.overlayRef.backdropClick(), this.overlayRef.detachments());
  protected overlayUnsubscribeSubject: Subject<void> | undefined;
  protected _minValue: number | Date | null              = null;
  protected _maxValue: number | Date | null              = null;
  protected filterIsValid: boolean                       = true;

  constructor(private registry: DataFilterRegistry, private overlay: Overlay, private elementRef: ElementRef) {
  }

  @Input() set maxValue(value: number | Date | null) {
    this._maxValue = value;
  }

  @Input() set inputReadonly(value: boolean) {
    this._inputReadonly = value;
  }

  @Input() set minValue(value: number | Date | null) {
    this._minValue = value;
  }

  @Input() set inputMask(value: FilterInputMask | null) {
    this._inputMask = value;
  }

  get disabled(): boolean {
    return this.isDisabled;
  }

  protected get filterChanged(): boolean {
    if (this.dataFilter === this.oldDataFilter) {
      return false;
    }

    if (this.dataFilter?.comparisonName === this.oldDataFilter?.comparisonName) {
      if (this.dataFilter?.values === this.oldDataFilter?.values) {
        return false;
      }

      return this.dataFilter != null &&
        this.oldDataFilter != null &&
        (this.dataFilter.values.length !== this.oldDataFilter.values.length ||
          this.dataFilter.values.some((v, index) => this.oldDataFilter!.values[index] !== v));
    }

    return true;
  }

  registerOnChange(fn: any): void {
    this.propagateChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  writeValue(dataFilter: DataFilter | null): void {
    this.oldDataFilter = this.dataFilter;
    this.dataFilter    = dataFilter;
  }

  protected propagateChanged = (_: DataFilter | null | undefined): void => {
  };

  protected propagateTouched = (): void => {
  };

  protected createOverlayRef(): OverlayRef {
    return this.overlay.create({
                                 hasBackdrop     : true,
                                 backdropClass   : this.backdropClass,
                                 scrollStrategy  : this.overlay.scrollStrategies.noop(),
                                 positionStrategy: this.overlay
                                                       .position()
                                                       .flexibleConnectedTo(this.elementRef)
                                                       .setOrigin(this.elementRef)
                                                       .withPositions([
                                                                        {
                                                                          originX : 'start',
                                                                          originY : 'bottom',
                                                                          overlayX: 'start',
                                                                          overlayY: 'top'
                                                                        },
                                                                        {
                                                                          originX : 'start',
                                                                          originY : 'top',
                                                                          overlayX: 'start',
                                                                          overlayY: 'bottom'
                                                                        },
                                                                        {
                                                                          originX : 'end',
                                                                          originY : 'bottom',
                                                                          overlayX: 'end',
                                                                          overlayY: 'top'
                                                                        },
                                                                        {
                                                                          originX : 'start',
                                                                          originY : 'top',
                                                                          overlayX: 'end',
                                                                          overlayY: 'bottom'
                                                                        }
                                                                      ])
                               });
  }

  @HostListener('click')
  protected onOverlayShown(): void {
    try {
      if (!this.isDisabled && !this.isOverlayVisible) {
        this.isOverlayVisible          = true;
        this.overlayUnsubscribeSubject = new Subject<void>();
        this.showOverlay();

        this.overlayClosingActions$
            .pipe(
              takeUntil(this.overlayUnsubscribeSubject)
            )
            .subscribe(() => this.hideOverlay());
      }
    } catch (e) {
      this.hideOverlay();
      throw e;
    }
  }

  protected showOverlay(): void {
    let componentType = this.registry.getFilterSelectorComponentType(this.filterType);

    if (!componentType) {
      throw new Error(`Unregistered Filter Selector Component ${ this.filterType }.`);
    }

    const data: FilterSelectorData = {
      defaultFilter : this.defaultFilter,
      filter        : this.dataFilter,
      valueListItems: this.valueListItems,
      inputMask     : this._inputMask,
      inputReadonly : this._inputReadonly,
      minValue      : this._minValue,
      maxValue      : this._maxValue
    };

    const injector     = Injector.create({ providers: [ { provide: FILTER_SELECTOR_DATA, useValue: data } ] });
    const portal       = new ComponentPortal<FilterSelectorBase>(componentType, null, injector);
    const componentRef = this.overlayRef.attach(portal);

    if (!!this.overlayUnsubscribeSubject) {
      combineLatest([
                      componentRef.instance.filterIsValid$,
                      componentRef.instance.filterChanged$
                    ])
        .pipe(takeUntil(this.overlayUnsubscribeSubject))
        .subscribe(([ isValid, filter ]) => {
          this.filterIsValid = isValid;

          if (isValid) {
            this.dataFilter = filter;
          }

          this.overlayRef.updatePosition();
          this.propagateTouched();
        });
    }
  }

  protected hideOverlay(): void {
    if (!this.isOverlayVisible) {
      return;
    }

    if (this.filterChanged) {
      this.oldDataFilter = this.dataFilter;

      this.propagateChanged(this.dataFilter);
    }

    if (this.filterIsValid) {
      this.overlayUnsubscribeSubject?.next();
      this.overlayUnsubscribeSubject?.complete();
      this.overlayRef.detach();

      this.isOverlayVisible = false;
    }
  }
}
