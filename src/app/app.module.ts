import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgSelectModule } from '@ng-select/ng-select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddIncomeComponent } from './components/adds/add-income/add-income.component';
import { AddOutcomeComponent } from './components/adds/add-outcome/add-outcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideHttpClient } from '@angular/common/http';
import { AddObservationComponent } from './components/adds/add-observation/add-observation.component';
import { AddGasolineTankComponent } from './components/adds/add-gasoline-tank/add-gasoline-tank.component';
import { AddMaintenanceComponent } from './components/adds/add-maintenance/add-maintenance.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { CacheService } from './services/cache.service';
import { ApiService } from './services/api.service';
import { NotificationService } from './services/notification.service';
import { NotificationPanelComponent } from './components/cards/notification-panel/notification-panel.component';
import { UploadStatusService } from './services/upload-status.service';
import { VehiclesPageModule } from './pages/vehicles/vehicles.module';

@NgModule({
  declarations: [
    AppComponent, 
    AddIncomeComponent, 
    AddOutcomeComponent, 
    AddObservationComponent, 
    AddGasolineTankComponent, 
    AddMaintenanceComponent, 
    DynamicFormComponent,
    //NotificationPanelComponent,
    // CardTaxComponent, CardTankComponent, CardMaintenanceComponent, DateFilterComponent
    
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule, 
    IonicStorageModule.forRoot(), 
    NgSelectModule

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}, 
    provideHttpClient(), 
    CacheService,
    ApiService,
    NotificationService,
    UploadStatusService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private cacheService: CacheService, private apiService: ApiService) {
    // Inyectar el servicio de caché en el ApiService
    this.apiService.setCacheService(this.cacheService);
  }
}