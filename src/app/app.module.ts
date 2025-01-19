import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddIncomeComponent } from './components/add-income/add-income.component';
import { AddOutcomeComponent } from './components/add-outcome/add-outcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { AddObservationComponent } from './components/add-observation/add-observation.component';
import { AddGasolineTankComponent } from './components/add-gasoline-tank/add-gasoline-tank.component';
import { AddMaintenanceComponent } from './components/add-maintenance/add-maintenance.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';

@NgModule({
  declarations: [AppComponent, AddIncomeComponent, AddOutcomeComponent, AddObservationComponent, AddGasolineTankComponent, AddMaintenanceComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule, IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, provideHttpClient() ],
  bootstrap: [AppComponent],
})
export class AppModule {}
