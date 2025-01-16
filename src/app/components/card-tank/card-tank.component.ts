import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

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
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.loadTank();
  }

  async loadTank() {
    this.tanks = await this.api.getTank();
  }

  async edit(event: Event, tankId: number) {
    return 0;
  }

  async delete(event: Event, tankId: number) {
    this.tankIdToDelete = tankId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea eliminar el registro?',
      color: 'warning',
      buttons: this.toastButtons
    })

    console.log('tankIdToDelete', this.tankIdToDelete);
    
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
