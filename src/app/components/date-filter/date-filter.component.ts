import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent {
  startDate: string = '';
  endDate: string = '';

  constructor(private popoverController: PopoverController) {}

  applyFilter() {
    this.popoverController.dismiss({
      startDate: this.startDate,
      endDate: this.endDate
    });
  }

  cancel() {
    this.popoverController.dismiss();
  }
}
