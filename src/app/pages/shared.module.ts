import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NotificationPanelComponent } from '../components/cards/notification-panel/notification-panel.component';

@NgModule({
  declarations: [
    NotificationPanelComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    NotificationPanelComponent
  ]
})
export class SharedModule { }