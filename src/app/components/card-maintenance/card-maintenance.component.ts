import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AddMaintenanceComponent } from '../add-maintenance/add-maintenance.component';

@Component({
  selector: 'app-card-maintenance',
  templateUrl: './card-maintenance.component.html',
  styleUrls: ['./card-maintenance.component.scss'],
})
export class CardMaintenanceComponent implements OnInit {

  maintenances: any
  maintenanceIdToDelete!: number;

  constructor(
    private api: ApiService,
    private popoverController: PopoverController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadMaintenance();
  }

  async loadMaintenance() {
    this.maintenances = await this.api.getMaintenance();
  }

  async filterByDate(startDate: string, endDate: string) {
    this.maintenances = await this.api.getMaintenanceByDateRange(startDate, endDate);  
  }

  async edit(event: Event, maintenanceId: number) {
    const popover = await this.popoverController.create({
      component: AddMaintenanceComponent,
      event: event,
      cssClass: 'custom-popover-class',
      side: 'bottom',
      alignment: 'center',
      componentProps: {
        'maintenanceId': maintenanceId
      }
    });

    popover.onDidDismiss().then(async () => {
      await this.loadMaintenance();
    });

    await popover.present();
  }

  async delete(event: Event, maintenanceId: number) {
    this.maintenanceIdToDelete = maintenanceId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea eliminar el registro?',
      color: 'warning',
      buttons: this.toastButtons
    })
    
    await toast.present();
  }

  deleteMaintenance(maintenanceId: number) {
    this.api.deleteTank(maintenanceId).then(async response => {
      console.log('Tank eliminado', response);
      this.maintenances = await this.api.getTank();
    }).catch(error => {
      console.error('Error al eliminar gasto', error);
    });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.deleteMaintenance(this.maintenanceIdToDelete);
      }
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];

}
