import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { OutcomePageRoutingModule } from './outcome-routing.module';
import { OutcomePage } from './outcome.page';
import { SharedModule } from '../shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    OutcomePageRoutingModule,
    SharedModule
  ],
  declarations: [
    OutcomePage
  ]
})
export class OutcomePageModule {}
