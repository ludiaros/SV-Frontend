import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AddGasolineTankComponent } from 'src/app/components/add-gasoline-tank/add-gasoline-tank.component';
import { AddMaintenanceComponent } from 'src/app/components/add-maintenance/add-maintenance.component';
import { CardMaintenanceComponent } from 'src/app/components/card-maintenance/card-maintenance.component';
import { CardTankComponent } from 'src/app/components/card-tank/card-tank.component';
import { DateFilterComponent } from 'src/app/components/date-filter/date-filter.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {

  @ViewChild(CardTankComponent) cardTankComponent!: CardTankComponent;
  @ViewChild(CardMaintenanceComponent) CardMaintenanceComponent!: CardMaintenanceComponent;

  activeTab: number = 0;
  subTabs: string[] = ["Obligaciones", "Mantenimientos", "Tanqueos"];

  constructor(
    private api: ApiService,
    private popoverController: PopoverController
  ) { }

  ngOnInit() {
  }

  toggleTab(tabName: string) {
    const tabIndex = this.subTabs.indexOf(tabName);
    if (tabIndex !== -1) {
      // this.activeTab = this.activeTab === tabIndex ? -1 : tabIndex;
      this.activeTab = tabIndex;
    }
  }

  async search(event: Event) {
    return;
  }

  async filterDate(event: Event) {
    
    
    const popover = await this.popoverController.create({
      component: DateFilterComponent,
      event: event,
      side: 'bottom',
      alignment: 'center'
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data?.startDate && data?.endDate) {
      
      if (this.activeTab === 1) {
        await this.CardMaintenanceComponent.filterByDate(data.startDate, data.endDate);
      } else if (this.activeTab === 2) {
        await this.cardTankComponent.filterByDate(data.startDate, data.endDate);
      }
    }
  }

  async add(event: Event) {
    if (this.activeTab === 1) {
      const popover = await this.popoverController.create({
        component: AddMaintenanceComponent,
        event: event,
        side: 'bottom',
        alignment: 'center',
      });

      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data?.maintenanceAdded) {
        await this.CardMaintenanceComponent.loadMaintenance();
      }

    } else {
      const popover = await this.popoverController.create({
        component: AddGasolineTankComponent,
        event: event,
        side: 'bottom',
        alignment: 'center',
      });

      await popover.present();

      const { data } = await popover.onDidDismiss();
      if (data?.tankAdded) {
        await this.cardTankComponent.loadTanks();
      }
    }
  }
}