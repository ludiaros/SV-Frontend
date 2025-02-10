import { Component } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-allowance',
  templateUrl: 'allowance.page.html',
  styleUrls: ['allowance.page.scss'],
  standalone: false,
})
export class AllowancePage {

  movements: any;
  filteredMovements: any;
  expandedItems: { [key: number]: any } = {};

  constructor(
    private api: ApiService,
  ) {
  }
  
  async ionViewDidEnter() {
    const response = await this.api.getAllowance();
    this.movements = response ? (Array.isArray(response) ? response : Object.values(response)) : [];
    this.filteredMovements = this.movements;
    
    // Actualizar los detalles de los items expandidos
    await this.refreshExpandedDetails();
  }

  private async refreshExpandedDetails() {
    // Actualizar los detalles de cada item expandido
    for (const movementId of Object.keys(this.expandedItems)) {
      const details = await this.api.getAllowanceById(Number(movementId));
      this.expandedItems[Number(movementId)] = {
        rootMovement: details.root_movement,
        movements: details.movements,
        summary: {
          totalIncome: details.totals.total_income,
          totalOutcome: details.totals.total_outcome,
          finalBalance: details.totals.final_balance
        }
      };
    }
  }

  search($event: any) {

    let keyword = $event.target.value.toLowerCase();

    this.filteredMovements = this.movements.filter((movement: any) => movement.details.toLowerCase().includes(keyword));
    
  }

  async toggleDetails(movementId: number) {
    if (this.expandedItems[movementId]) {
      delete this.expandedItems[movementId];
    } else {
      const details = await this.api.getAllowanceById(movementId);
      this.expandedItems[movementId] = {
        rootMovement: details.root_movement,
        movements: details.movements,
        summary: {
          totalIncome: details.totals.total_income,
          totalOutcome: details.totals.total_outcome,
          finalBalance: details.totals.final_balance
        }
      };
    }
  }

  isExpanded(movementId: number): boolean {
    return !!this.expandedItems[movementId];
  }
}
