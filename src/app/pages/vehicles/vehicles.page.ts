import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {

  activeTab: number = 0;
  subTabs: string[] = ["Obligaciones", "Mantenimientos", "Tanqueos"];

  constructor() { }

  ngOnInit() {
  }

  toggleTab(tabName: string) {
    const tabIndex = this.subTabs.indexOf(tabName);
    if (tabIndex !== -1) {
      // this.activeTab = this.activeTab === tabIndex ? -1 : tabIndex;
      this.activeTab = tabIndex;
    }
  }

  async search($event: any) {
    return 0;
  }

  async add($event: any) {
    return 0;
  }

}