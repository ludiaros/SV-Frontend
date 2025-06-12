import { Component } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { AddOutcomeComponent } from 'src/app/components/adds/add-outcome/add-outcome.component';

import { ApiService } from 'src/app/services/api.service';
import { PopoverService } from 'src/app/services/ui/popover.service';


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
    private popoverService: PopoverService,
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

  async add() {
    this.isAddDisabled = true;

    await this.popoverService.showPopover(
      AddOutcomeComponent,
      {},
      async () => {
        await this.loadMovements();
        this.isAddDisabled = false;
      },
      'custom-popover-class'
    );
  }


  async edit(movementId: number) {
    this.isEditDisabled = true;

    await this.popoverService.showPopover(
      AddOutcomeComponent,
      { movementId },
      async () => {
        await this.loadMovements();
        this.isEditDisabled = false;
      },
      'custom-popover-class'
    );
  }


  async delete(outcomeId: number) {
    if (this.isDeleteDisabled) return;

    this.isDeleteDisabled = true;
    this.isOverlayActive = true;
    this.outcomeIdToDelete = outcomeId;

    await this.popoverService.showConfirmationToast(
      '¿Desea eliminar el registro?',
      this.toastButtons,
      () => {
        this.isDeleteDisabled = false;
        this.isOverlayActive = false;
      }
    );
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
