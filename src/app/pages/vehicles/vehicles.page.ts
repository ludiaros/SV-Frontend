import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
})
export class VehiclesPage implements OnInit {

  activeTabs: number[] = []; 
  subTabs: string[] = ["Impuestos", "Mantenimientos", "Tanqueos"];

  constructor() { }



  ngOnInit() {
  }

}
