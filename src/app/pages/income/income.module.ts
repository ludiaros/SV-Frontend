import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IncomePage } from './income.page';

import { IncomePageRoutingModule } from './income-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    IncomePageRoutingModule,
  ],
  declarations: [IncomePage]
})
export class IncomePageModule {}
