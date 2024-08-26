import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OutcomePageRoutingModule } from './outcome-routing.module';
import { OutcomePage } from './outcome.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OutcomePageRoutingModule
  ],
  declarations: [
    OutcomePage
  ]
})
export class OutcomePageModule {}
