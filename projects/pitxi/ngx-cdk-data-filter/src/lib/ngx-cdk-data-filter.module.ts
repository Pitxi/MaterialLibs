import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Overlay } from '@angular/cdk/overlay';
import { CdkDataFilterDirective } from './cdk-data-filter.directive';

@NgModule({
            declarations: [
    CdkDataFilterDirective
  ],
            imports     : [
              CommonModule
            ],
            providers   : [ Overlay ]
          })
export class NgxCdkDataFilterModule {
}
