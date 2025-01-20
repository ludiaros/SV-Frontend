import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-card-tax',
  templateUrl: './card-tax.component.html',
  styleUrls: ['./card-tax.component.scss'],
})
export class CardTaxComponent  implements OnInit {

  taxes: any;

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.loadTax();
  }

  async loadTax() {
    this.taxes = await this.api.getTax();
  }

  async filterByDescription(description: string) {
    if (!description) {
      await this.loadTax();
      return;
    }
    this.taxes = await this.api.searchTaxesByDescription(description);
  }
}
