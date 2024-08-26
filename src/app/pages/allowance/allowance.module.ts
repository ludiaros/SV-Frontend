import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AllowancePage } from './allowance.page';

import { AllowancePageRoutingModule } from './allowance-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AllowancePageRoutingModule
  ],
  declarations: [AllowancePage]
})
export class AllowancePageModule {}
