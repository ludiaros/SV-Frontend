import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  userData: any;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUser().then(data => {
      this.userData = data;
      console.log('Información del usuario:', this.userData);
      
    }).catch(error => {
      console.error('Error al obtener la información del usuario:', error);
      console.error('Status code:', error.status);
      console.error('Mensaje:', error.message);
      console.error('Respuesta del servidor:', error.error);
    });
  }

}
