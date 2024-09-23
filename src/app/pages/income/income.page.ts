import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { AddIncomeComponent } from 'src/app/components/add-income/add-income.component';

import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-income',
  templateUrl: 'income.page.html',
  styleUrls: ['income.page.scss'],
})
export class IncomePage {
  movements: any;
  filteredMovements: any;
  incomeIdToDelete!: number;

  constructor(
    private popoverController: PopoverController,
    private toastController: ToastController,
    private api: ApiService
  ) {}

  async ionViewDidEnter() {
    this.loadMovements();
  }

  async loadMovements() {
    this.movements = await this.api.getIncome();
    console.log(this.movements);
    
    this.filteredMovements = this.movements;
  }

  search($event: any) {
    let keyword = $event.target.value.toUpperCase();

    this.filteredMovements = this.movements.filter((movement: any) =>
      movement.details.includes(keyword)
    );
  }

  async add(event: Event) {
    const popover = await this.popoverController.create({
      component: AddIncomeComponent,
      event: event,
      side: 'bottom',
      alignment: 'center',
    });
    
    popover.onDidDismiss().then(async () => {
      await this.loadMovements();
    });

    await popover.present();
  }

  async edit(event: Event, movementId: number) {
    const popover = await this.popoverController.create({
      component: AddIncomeComponent,
      event: event,
      cssClass: 'custom-popover-class',
      side: 'bottom',
      alignment: 'center',
      componentProps: {
        'movementId': movementId
      }
    });

    popover.onDidDismiss().then(async () => {
      await this.loadMovements();
    });

    await popover.present();
  }

  async delete(event: Event, incomeId: number) {
    this.incomeIdToDelete = incomeId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea eliminar el registro?',
      color: 'warning',
      buttons: this.toastButtons,
    });

    await toast.present();
  }

  deleteIncome(incomeId: number) {
    this.api
      .deleteIncome(incomeId)
      .then(async (response) => {
        this.filteredMovements = await this.api.getIncome();
        console.log(response.message);
      })
      .catch((error) => {
        console.error('Error al eliminar ingreso', error);
      });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.deleteIncome(this.incomeIdToDelete);
      },
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}
