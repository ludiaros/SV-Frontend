import { Component, OnInit, ViewChild } from '@angular/core';
import { AddGasolineTankComponent } from 'src/app/components/adds/add-gasoline-tank/add-gasoline-tank.component';
import { AddMaintenanceComponent } from 'src/app/components/adds/add-maintenance/add-maintenance.component';
import { CardMaintenanceComponent } from 'src/app/components/cards/card-maintenance/card-maintenance.component';
import { CardTankComponent } from 'src/app/components/cards/card-tank/card-tank.component';
import { CardTaxComponent } from 'src/app/components/cards/card-tax/card-tax.component';
import { DateFilterComponent } from 'src/app/components/date-filter/date-filter.component';
import { ApiService } from 'src/app/services/api.service';
import { PopoverService } from 'src/app/services/ui/popover.service';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
  standalone: false,
})
export class VehiclesPage implements OnInit {

  @ViewChild(CardTankComponent) cardTankComponent!: CardTankComponent;
  @ViewChild(CardMaintenanceComponent) cardMaintenanceComponent!: CardMaintenanceComponent;
  @ViewChild(CardTaxComponent) cardTaxComponent!: CardTaxComponent;

  activeTab: number = 0;
  subTabs: string[] = ["Obligaciones", "Mantenimientos", "Tanqueos"];

  constructor(
    private api: ApiService,
    private popoverService: PopoverService
  ) { }

  ngOnInit() { }

  toggleTab(tabName: string) {
    const tabIndex = this.subTabs.indexOf(tabName);
    if (tabIndex !== -1) {
      this.activeTab = tabIndex;
    }
  }

  async search(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value;

    if (this.activeTab === 1) {
      await this.cardMaintenanceComponent.filterByDescription(searchTerm);
    } else if (this.activeTab === 2) {
      await this.cardTankComponent.filterByDescription(searchTerm);
    } else if (this.activeTab === 0) {
      await this.cardTaxComponent.filterByDescription(searchTerm);
    }
  }

  async filterDate() { // Quitamos el parámetro 'event'
    await this.popoverService.showPopover(
      DateFilterComponent,
      {},
      async (popoverData?: any) => {
        const data = popoverData?.data;
        if (data?.startDate && data?.endDate) {
          if (this.activeTab === 1) {
            await this.cardMaintenanceComponent.filterByDate(data.startDate, data.endDate);
          } else if (this.activeTab === 2) {
            await this.cardTankComponent.filterByDate(data.startDate, data.endDate);
          }
        }
      },
      'custom-popover-class'
    );
  }

  async add() { // Quitamos el parámetro 'event'
    if (this.activeTab === 1) {
      await this.popoverService.showPopover(
        AddMaintenanceComponent,
        {},
        async (popoverData?: any) => {
          const data = popoverData?.data;
          if (data?.maintenanceAdded) {
            await this.cardMaintenanceComponent.loadMaintenance();
          }
        },
        'custom-popover-class'
      );
    } else if (this.activeTab === 2) {
      await this.popoverService.showPopover(
        AddGasolineTankComponent,
        {},
        async (popoverData?: any) => {
          const data = popoverData?.data;
          if (data?.tankAdded) {
            await this.cardTankComponent.loadTanks();
          }
        },
        'custom-popover-class'
      );
    }
  }
}
