import { Component, OnInit } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { AddObservationComponent } from 'src/app/components/add-observation/add-observation.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
})
export class RoutePage implements OnInit {
  routes: any;
  filteredRoutes: any;
  activeRoutes: number[] = []; 
  routesName: string[] = []; 
  routeMap: { [key: string]: number } = {};
  routeId!: number;
  type!: string;
  id!: number;

  constructor(
    private api: ApiService,
    private popoverController: PopoverController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadRoutes();
  }

  async loadRoutes() {
    this.routes = await this.api.getRoute();
    console.log(this.routes);
    
    const uniqueRouteNames: { [key: string]: boolean } = {};
  
    this.routes.forEach((route: any) => {
      let routeName = `Ruta ${route.route_id}`;
  
      if (!uniqueRouteNames[routeName]) {
        uniqueRouteNames[routeName] = true;
        this.routesName.push(routeName);
        this.routeMap[routeName] = route.route_id;
      }
    });
  
    this.filteredRoutes = this.routes;
  } 

  toggleRoute(routeName: string) {
    const routeId = this.routeMap[routeName];

    if (this.activeRoutes.includes(routeId)) {
      this.activeRoutes = this.activeRoutes.filter(activeRouteId => activeRouteId !== routeId);
    } else {
      this.activeRoutes.push(routeId);
    }

    if (this.activeRoutes.length === 0) {
      this.filteredRoutes = [];
    } else {
      this.filteredRoutes = this.routes.filter((route: any) =>
        this.activeRoutes.includes(route.route_id)
      );
    }
  }

  search($event: any) {
    const keyword = $event.target.value.toUpperCase();

    this.filteredRoutes = this.routes.filter((route: any) =>
      route.client_name.includes(keyword)
    );
  }

  async observation(event: Event, referralType:string, referralId: number) {
    const popover = await this.popoverController.create({
      component: AddObservationComponent,
      event: event,
      cssClass: 'custom-popover-class',
      side: 'bottom',
      alignment: 'center',
      componentProps: {
        referralType: referralType,
        referralId: referralId,
      },
    });

    popover.onDidDismiss().then(async () => {
      this.filteredRoutes = await this.api.getRoute();
    });

    await popover.present();
  }

  async check(event: Event, type: string, id: number) {
    this.type = type;
    this.id = id;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea dar como entregada esta ruta?',
      color: 'warning',
      buttons: this.toastButtons,
    });

    await toast.present();
  }

  checkRoute(type: string, id: number) {
    this.api.checkRouteReferral(type, id).then(async response => {
      this.filteredRoutes =  await this.api.getRoute();
    }).catch(error => {
      console.error('Error al intentar entregar la ruta', error);
    });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.checkRoute(this.type, this.id);
        
      }
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}
