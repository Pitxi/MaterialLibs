import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DataFilterShowcaseComponent } from './data-filter-showcase.component';

const routes: Routes = [
  { path: '', component: DataFilterShowcaseComponent }
];

@NgModule({
            declarations: [],
            imports     : [
              CommonModule,
              RouterModule.forChild(routes)
            ],
            exports     : [ RouterModule ]
          })
export class DataFilterShowcaseRoutingModule {
}
