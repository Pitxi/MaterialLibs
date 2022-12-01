import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path      : '',
    pathMatch : 'full',
    redirectTo: '/data-filter'
  },
  {
    title       : 'Data Filter Showcase',
    path        : 'data-filter',
    loadChildren: async () => (await import('./data-filter-showcase/data-filter-showcase.module')).DataFilterShowcaseModule
  },
  {
    path: '**',
    pathMatch : 'full',
    redirectTo: '/data-filter'
  }
];

@NgModule({
            imports: [ RouterModule.forRoot(routes) ],
            exports: [ RouterModule ]
          })
export class AppRoutingModule {
}
