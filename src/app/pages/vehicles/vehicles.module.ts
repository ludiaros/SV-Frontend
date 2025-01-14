import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiclesPageRoutingModule } from './vehicles-routing.module';

import { VehiclesPage } from './vehicles.page';
import { CardTaxComponent } from 'src/app/components/card-tax/card-tax.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehiclesPageRoutingModule
  ],
  declarations: [VehiclesPage, CardTaxComponent]
})
export class VehiclesPageModule {}
