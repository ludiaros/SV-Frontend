import { Component } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-allowance',
  templateUrl: 'allowance.page.html',
  styleUrls: ['allowance.page.scss']
})
export class AllowancePage {

  movements: any;
  filteredMovements: any;

  constructor(
    private api: ApiService,
  ) {
  }

  async ionViewDidEnter() {
    const response = await this.api.getAllowance();
    // Convertir a array inmediatamente
    this.movements = response ? (Array.isArray(response) ? response : Object.values(response)) : [];
    this.filteredMovements = this.movements;
  }

  search($event: any) {

    let keyword = $event.target.value.toLowerCase();

    this.filteredMovements = this.movements.filter((movement: any) => movement.details.toLowerCase().includes(keyword));
    
  }
}
