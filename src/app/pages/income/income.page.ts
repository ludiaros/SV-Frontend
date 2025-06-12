import { Component } from '@angular/core';
import { AddIncomeComponent } from 'src/app/components/adds/add-income/add-income.component';
import { ApiService } from 'src/app/services/api.service';
import { PopoverService } from 'src/app/services/ui/popover.service';

@Component({
  selector: 'app-income',
  templateUrl: 'income.page.html',
  styleUrls: ['income.page.scss'],
  standalone: false,
})
export class IncomePage {
  movements: any;
  filteredMovements: any;
  incomeIdToDelete!: number;
  isAddDisabled = false;
  isEditDisabled = false;
  isDeleteDisabled = false;
  isOverlayActive = false;

  constructor(
    private api: ApiService,
    private popoverService: PopoverService
  ) { }

  async ionViewDidEnter() {
    this.loadMovements();
  }

  async loadMovements() {
    this.movements = await this.api.getIncome();

    this.filteredMovements = this.movements;
  }

  search($event: any) {
    let keyword = $event.target.value.toLowerCase();

    this.filteredMovements = this.movements.filter((movement: any) =>
      movement.details.toLowerCase().includes(keyword)
    );
  }

  async add(event: Event) {
    this.isAddDisabled = true;

    await this.popoverService.showPopover(
      AddIncomeComponent,
      {},
      async () => {
        await this.loadMovements();
        this.isAddDisabled = false;
      },
      'custom-popover-class'
    );
  }

  async edit(event: Event, movementId: number) {
    this.isEditDisabled = true;

    await this.popoverService.showPopover(
      AddIncomeComponent,
      { movementId },
      async () => {
        await this.loadMovements();
        this.isEditDisabled = false;
      },
      'custom-popover-class'
    );
  }

  async delete(event: Event, incomeId: number) {
    if (this.isDeleteDisabled) return;

    this.isDeleteDisabled = true;
    this.isOverlayActive = true;
    this.incomeIdToDelete = incomeId;

    await this.popoverService.showConfirmationToast(
      '¿Desea eliminar el registro?',
      this.toastButtons,
      () => {
        this.isDeleteDisabled = false;
        this.isOverlayActive = false;
      }
    );
  }

  deleteIncome(incomeId: number) {
    this.api
      .deleteIncome(incomeId)
      .then(async () => {
        this.filteredMovements = await this.api.getIncome();
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
