import { TestBed } from '@angular/core/testing';

import { NgxMatDataFilterIntl } from './ngx-mat-data-filter-intl';

describe('NgxMatDataFilterIntlService', () => {
  let service: NgxMatDataFilterIntl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatDataFilterIntl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
