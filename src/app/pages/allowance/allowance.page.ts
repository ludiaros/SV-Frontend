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

    this.movements = await this.api.getAllowance();

    this.filteredMovements = this.movements;
  }

  search($event: any) {

    let keyword = $event.target.value.toUpperCase();

    this.filteredMovements = this.movements.filter((movement: any) => movement.details.includes(keyword));
  }
}
