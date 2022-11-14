import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DataFilter, ValueListItem } from '../../../ngx-material-components/src/public-api';
import { distinctUntilChanged, map, startWith } from 'rxjs';

@Component({
             selector       : 'app-root',
             templateUrl    : './app.component.html',
             styleUrls      : [ './app.component.scss' ],
             changeDetection: ChangeDetectionStrategy.OnPush
           })
export class AppComponent {
  readonly form          = this.fBuilder.group({
                                                 valueListFilter: new FormControl<DataFilter | null>(null),
                                                 stringFilter   : new FormControl<DataFilter | null>(null),
                                                 numberFilter   : new FormControl<DataFilter | null>(null),
                                                 dateFilter     : new FormControl<DataFilter | null>(null)
                                               });
  readonly formDirty$    = this.form.statusChanges.pipe(map(_ => this.form.dirty));
  readonly dirtyFilters$ = this.form.statusChanges
                               .pipe(
                                 map(_ => Object.keys(this.form.controls)
                                                .filter(key => this.form.get(key)!.dirty)),
                                 startWith([] as string[])
                               );

  readonly valueListFilterItems: ValueListItem[] = Array.from(
    { length: 50 },
    (_, index) => ({
      value      : `option ${ index }`,
      description: `Option number ${ (index + 1).toString().padStart(2, '0') }`
    })
  );

  constructor(private fBuilder: FormBuilder) {
    this.form.valueChanges.pipe(distinctUntilChanged()).subscribe(console.log);
  }

  resetFilter() {
    this.form.reset();
  }
}
