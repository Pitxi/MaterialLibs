import { TestBed } from '@angular/core/testing';

import { DataFilterRegistry } from './data-filter-registry.service';

describe('DataFilterRegistry', () => {
  let service: DataFilterRegistry;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFilterRegistry);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
