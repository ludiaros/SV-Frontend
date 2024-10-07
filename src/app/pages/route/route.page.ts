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
  activeRoutes: string[] = [];
  routesName: string[] = ['Ruta 1', 'Ruta 2'];
  routeId!: number;

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
    
    this.filteredRoutes = this.routes;
  }

  toggleRoute(route: string) {
    if (this.activeRoutes.includes(route)) {
      this.activeRoutes = this.activeRoutes.filter(activeRoute => activeRoute !== route);
    } else {
      this.activeRoutes.push(route);
    }

    if (this.activeRoutes.length === 0) {
      this.filteredRoutes = this.routes;
    } else {
      this.filteredRoutes = this.routes.filter((r: any) =>
        this.activeRoutes.includes(r.route_id)
      );
    }
  }

  search($event: any) {
    const keyword = $event.target.value.toUpperCase();

    this.filteredRoutes = this.routes.filter((movement: any) =>
      movement.details.includes(keyword)
    );
  }

  async observation(event: Event, routeId: number) {
    const popover = await this.popoverController.create({
      component: AddObservationComponent,
      event: event,
      cssClass: 'custom-popover-class',
      side: 'bottom',
      alignment: 'center',
      componentProps: {
        routeId: routeId,
      },
    });

    popover.onDidDismiss().then(async () => {
      await this.loadRoutes();
    });

    await popover.present();
  }

  async check(event: Event, routeId: number) {
    this.routeId = routeId;
    const toast = await this.toastController.create({
      position: 'middle',
      message: '¿Desea dar como entregada esta ruta?',
      color: 'warning',
      buttons: this.toastButtons,
    });

    await toast.present();
  }

  checkRoute(outcomeId: number) {
    this.api.deleteOutcome(outcomeId).then(async response => {
      this.filteredRoutes =  await this.api.getOutcome();
    }).catch(error => {
      console.error('Error al intentar entregar la ruta', error);
    });
  }

  public toastButtons = [
    {
      text: 'Sí',
      role: 'info',
      handler: () => {
        this.checkRoute(this.routeId);
      }
    },
    {
      text: 'No',
      role: 'cancel',
    },
  ];
}
