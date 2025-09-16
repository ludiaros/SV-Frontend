import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiclesPageRoutingModule } from './vehicles-routing.module';

import { VehiclesPage } from './vehicles.page';
import { CardTaxComponent } from 'src/app/components/cards/card-tax/card-tax.component';
import { CardTankComponent } from 'src/app/components/cards/card-tank/card-tank.component';
import { CardMaintenanceComponent } from 'src/app/components/cards/card-maintenance/card-maintenance.component';
import { DateFilterComponent } from 'src/app/components/date-filter/date-filter.component';
import { NotificationPanelComponent } from 'src/app/components/cards/notification-panel/notification-panel.component';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiclesPageRoutingModule,
    SharedModule
  ],
  declarations: [VehiclesPage, CardTaxComponent, CardTankComponent, CardMaintenanceComponent, DateFilterComponent]
})
export class VehiclesPageModule {}
