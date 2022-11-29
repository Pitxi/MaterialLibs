import { TestBed } from '@angular/core/testing';

import { NgxMatDataFilterConfiguration } from './ngx-mat-data-filter-configuration';

describe('MatDataFilterConfigurationService', () => {
  let service: NgxMatDataFilterConfiguration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxMatDataFilterConfiguration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
