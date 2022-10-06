import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDataFilterModule } from '../../../ngx-material-components/src/public-api';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
            declarations: [
              AppComponent
            ],
              imports: [
                  BrowserModule,
                  AppRoutingModule,
                  BrowserAnimationsModule,
                  ReactiveFormsModule,
                  MatButtonModule,
                  MatIconModule,
                  NgxMatDataFilterModule
              ],
            providers   : [],
            bootstrap   : [ AppComponent ]
          })
export class AppModule {
}
