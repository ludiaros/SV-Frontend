import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AddMaintenanceComponent } from '../add-maintenance/add-maintenance.component';

@Component({
  selector: 'app-card-maintenance',
  templateUrl: './card-maintenance.component.html',
  styleUrls: ['./card-maintenance.component.scss'],
  standalone: false,
})
export class CardMaintenanceComponent implements OnInit {

  maintenances: any
  maintenanceIdToDelete!: number;
  isEditDisabled = false;
  isDeleteDisabled = false;
  isOverlayActive = false;

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

  async filterByDescription(description: string) {
    if (!description) {
      await this.loadMaintenance();
      return;
    }
    this.maintenances = await this.api.searchMaintenanceByDescription(description);
  }

  async edit(event: Event, maintenanceId: number) {
    this.isEditDisabled = true;
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
      this.isEditDisabled = false;
    });

    await popover.present();
  }

  async delete(event: Event, maintenanceId: number) {
    if (this.isDeleteDisabled) return;
    this.isDeleteDisabled = true;
    this.isOverlayActive = true;
    this.maintenanceIdToDelete = maintenanceId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea eliminar el registro?',
      color: 'warning',
      buttons: this.toastButtons
    })

    toast.onDidDismiss().then(() => {
      this.isDeleteDisabled = false;
      this.isOverlayActive = false;
    });
    
    await toast.present();
  }

  deleteMaintenance(maintenanceId: number) {
    this.api.deleteMaintenance(maintenanceId).then(async response => {
      console.log('Mantenimiento eliminado', response);
      this.maintenances = await this.api.getMaintenance();
    }).catch(error => {
      console.error('Error al eliminar mantenimiento', error);
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
