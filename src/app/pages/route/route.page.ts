import { Component, OnInit } from '@angular/core';
import { AddObservationComponent } from 'src/app/components/adds/add-observation/add-observation.component';
import { ApiService } from 'src/app/services/api.service';
import { PopoverService } from 'src/app/services/ui/popover.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.page.html',
  styleUrls: ['./route.page.scss'],
  standalone: false,
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
  isEditDisabled = false;
  isCheckDisabled = false;
  isOverlayActive = false;

  constructor(
    private api: ApiService,
    private popoverService: PopoverService
  ) {}

  ngOnInit() {
    this.loadRoutes();
  }

  async loadRoutes() {
    this.routes = await this.api.getRoute();

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

  async observation(event: Event, referralType: string, referralId: number) {
    this.isEditDisabled = true;

    await this.popoverService.showPopover(
      AddObservationComponent,
      {
        referralType: referralType,
        referralId: referralId,
      },
      async () => {
        this.filteredRoutes = await this.api.getRoute();
        this.isEditDisabled = false;
      },
      'custom-popover-class'
    );
  }

  async check(event: Event, type: string, id: number) {
    if (this.isCheckDisabled) return;

    this.isCheckDisabled = true;
    this.isOverlayActive = true;
    this.type = type;
    this.id = id;

    await this.popoverService.showConfirmationToast(
      '¿Desea dar como entregada esta ruta?',
      [
        {
          text: 'Sí',
          role: 'info',
          handler: () => this.checkRoute(this.type, this.id)
        },
        {
          text: 'No',
          role: 'cancel',
        }
      ],
      () => {
        this.isCheckDisabled = false;
        this.isOverlayActive = false;
      }
    );
  }

  checkRoute(type: string, id: number) {
    this.api.checkRouteReferral(type, id).then(async response => {
      this.filteredRoutes = await this.api.getRoute();
    }).catch(error => {
      console.error('Error al intentar entregar la ruta', error);
    });
  }
}
