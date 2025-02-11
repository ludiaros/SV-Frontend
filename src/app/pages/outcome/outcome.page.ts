import { Component } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { AddOutcomeComponent } from 'src/app/components/add-outcome/add-outcome.component';

import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-outcome',
  templateUrl: 'outcome.page.html',
  styleUrls: ['outcome.page.scss'],
  standalone: false,
})
export class OutcomePage {

  movements: any;
  filteredMovements: any;
  outcomeIdToDelete!: number;
  isAddDisabled = false;
  isEditDisabled = false;
  isDeleteDisabled = false;
  isOverlayActive = false;

  constructor(
    private popoverController: PopoverController,
    private toastController: ToastController,
    private api: ApiService,
  ) {
  }

  async ionViewDidEnter() {

    this.loadMovements();
  }

  async loadMovements() {
    this.movements = await this.api.getOutcome();
    this.filteredMovements = this.movements;
  }

  search($event: any) {

    let keyword = $event.target.value.toLowerCase();

    this.filteredMovements = this.movements.filter((movement: any) => movement.details.toLowerCase().includes(keyword));
    
  }

  async add(event: Event) {
    this.isAddDisabled = true;
    const popover = await this.popoverController.create({
      component: AddOutcomeComponent,
      event: event,
      side: 'bottom',
      alignment: 'center',
    });

    popover.onDidDismiss().then(async () => {
      await this.loadMovements();
      this.isAddDisabled = false;
    });

    await popover.present();
  }

  async edit(event: Event, movementId: number) {
    this.isEditDisabled = true;
    const popover = await this.popoverController.create({
      component: AddOutcomeComponent,
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
      this.isEditDisabled = false;
    });

    await popover.present();
  }

  async delete(event: Event, outcomeId: number) {
    if (this.isDeleteDisabled) return;
    this.isDeleteDisabled = true;
    this.isOverlayActive = true;
    this.outcomeIdToDelete = outcomeId;
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

  deleteOutcome(outcomeId: number) {
    this.api.deleteOutcome(outcomeId).then(async response => {
      this.filteredMovements = await this.api.getOutcome();
    }).catch(error => {
      console.error('Error al eliminar gasto', error);
    });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.deleteOutcome(this.outcomeIdToDelete);
      }
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}
