import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { HttpClientModule } from '@angular/common/http';
import { FlexModule } from '@angular/flex-layout';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxMaterialComponentsModule } from '../../../pitxi/ngx-material-components/src/lib';

@NgModule({
            declarations: [
              AppComponent
            ],
            imports     : [
              BrowserModule,
              AppRoutingModule,
              BrowserAnimationsModule,
              HttpClientModule,
              ReactiveFormsModule,
              MatButtonModule,
              MatIconModule,
              MatNativeDateModule,
              NgxMaterialComponentsModule,
              MatTableModule,
              FlexModule,
              MatPaginatorModule
            ],
            providers   : [],
            bootstrap   : [ AppComponent ]
          })
export class AppModule {
}
