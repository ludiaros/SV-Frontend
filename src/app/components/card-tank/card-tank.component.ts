import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AddGasolineTankComponent } from '../add-gasoline-tank/add-gasoline-tank.component';

@Component({
  selector: 'app-card-tank',
  templateUrl: './card-tank.component.html',
  styleUrls: ['./card-tank.component.scss'],
})
export class CardTankComponent  implements OnInit {

  tanks: any
  tankIdToDelete!: number;

  constructor(
    private api: ApiService,
    private popoverController: PopoverController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadTanks();
  }

  async loadTanks() {
    this.tanks = await this.api.getTank();
    
  }

  async filterByDate(startDate: string, endDate: string) {
    this.tanks = await this.api.getTankByDateRange(startDate, endDate);
  }

  async filterByDescription(description: string) {
    if (!description) {
      await this.loadTanks();
      return;
    }
    this.tanks = await this.api.searchTanksByDescription(description);
  }

  async edit(event: Event, tankId: number) {
    const popover = await this.popoverController.create({
      component: AddGasolineTankComponent,
      event: event,
      cssClass: 'custom-popover-class',
      side: 'bottom',
      alignment: 'center',
      componentProps: {
        'tankId': tankId
      }
    });

    popover.onDidDismiss().then(async () => {
      await this.loadTanks();
    });

    await popover.present();
  }

  async delete(event: Event, tankId: number) {
    this.tankIdToDelete = tankId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea eliminar el registro?',
      color: 'warning',
      buttons: this.toastButtons
    })
    
    await toast.present();
  }

  deleteTank(tankId: number) {
    this.api.deleteTank(tankId).then(async response => {
      console.log('Tank eliminado', response);
      this.tanks = await this.api.getTank();
    }).catch(error => {
      console.error('Error al eliminar gasto', error);
    });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.deleteTank(this.tankIdToDelete);
      }
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}
