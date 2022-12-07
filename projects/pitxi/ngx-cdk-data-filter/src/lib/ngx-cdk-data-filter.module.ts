import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay';
import { CdkDataFilterDirective } from './cdk-data-filter.directive';
import { DATA_FILTER_REGISTRY_CONFIG, RegistryConfig } from './registry-config';
import { DataFilterRegistry } from './data-filter-registry.service';

@NgModule({
            declarations: [
              CdkDataFilterDirective
            ],
            imports     : [
              CommonModule
            ],
            exports     : [
              CdkDataFilterDirective
            ],
            providers   : [ Overlay ]
          })
export class NgxCdkDataFilterModule {
  constructor(@Optional() @SkipSelf() parent: NgxCdkDataFilterModule) {
    if (!!parent) {
      throw new Error('NgxCdkDataFilterModule is already loaded. Please add it in AppModule only.');
    }
  }
  static forRoot(config: RegistryConfig): ModuleWithProviders<NgxCdkDataFilterModule> {
    return {
      ngModule : NgxCdkDataFilterModule,
      providers: [ { provide: DATA_FILTER_REGISTRY_CONFIG, useValue: config }, DataFilterRegistry ]
    };
  }
}
