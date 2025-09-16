import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private cacheService: any; // Inyectado dinámicamente para evitar dependencias circulares

  constructor(private http: HttpClient, private tokenService: TokenService, private notificationService: NotificationService) { }

  // Método para inyectar el servicio de caché
  setCacheService(cacheService: any) {
    this.cacheService = cacheService;
  }

  // Método helper para manejar peticiones con caché
  private async executeWithCache(
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    description: string = 'Petición'
  ) {
    const notificationId = this.notificationService.addPendingRequest(description);

    try {
      const options = await this.getHttpOptions(method, url, data);

      let response: HttpResponse;
      switch (method) {
        case 'POST':
          response = await CapacitorHttp.post(options);
          break;
        case 'PUT':
          response = await CapacitorHttp.put(options);
          break;
        case 'DELETE':
          response = await CapacitorHttp.delete(options);
          break;
        case 'PATCH':
          response = await CapacitorHttp.patch(options);
          break;
        default:
          throw new Error(`Método HTTP no soportado: ${method}`);
      }

      // Petición exitosa
      this.notificationService.markAsSuccess(notificationId, `${description} - Completado`);
      return response.data;
    } catch (error) {
      console.error(`Error en ${description}:`, error);

      // Marcar como fallida en notificaciones
      this.notificationService.markAsFailed(notificationId, `${description} - Error, reintentando...`);

      // Guardar en caché si hay error
      if (this.cacheService) {
        await this.cacheService.addFailedRequest(method, url, data, description);
      }

      throw error;
    }
  }

  async registerToken() {
    const token = await this.tokenService.getToken();
    return this.http
      .post(`${environment.apiUrl}/register-token`, {
        device_token: token,
      })
      .toPromise();
  }

  async getUser() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/get-user`, { headers }).toPromise();
  }

  async getAllowance() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/allowance`, { headers }).toPromise();
  }

  async getIncome() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/income`, { headers }).toPromise();
  }

  async getOutcome() {
    this.registerToken();
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/outcome`, { headers }).toPromise();
  }

  async getRoute() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/referral`, { headers }).toPromise();
  }

  async getTax() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/tax`, { headers }).toPromise();
  }

  async getTank() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/tank`, { headers }).toPromise();
  }

  async getMaintenance() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/maintenance`, { headers }).toPromise();
  }

  async getVehicles() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/vehicle/all`, { headers }).toPromise();
  }

  async getClient() {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/client`, { headers }).toPromise();
  }

  async deleteIncome(incomeId: number) {
    return this.executeWithCache(
      'PUT',
      `${environment.apiUrl}/income/${incomeId}/delete`,
      undefined,
      `Eliminar ingreso ${incomeId}`
    );
  }

  async deleteOutcome(outcomeId: number) {
    return this.executeWithCache(
      'PUT',
      `${environment.apiUrl}/outcome/${outcomeId}/delete`,
      undefined,
      `Eliminar egreso ${outcomeId}`
    );
  }

  async deleteTank(tankId: number) {
    return this.executeWithCache(
      'PUT',
      `${environment.apiUrl}/tank/${tankId}/delete`,
      undefined,
      `Eliminar tanque ${tankId}`
    );
  }

  async deleteMaintenance(maintenanceId: number) {
    return this.executeWithCache(
      'PUT',
      `${environment.apiUrl}/maintenance/${maintenanceId}/delete`,
      undefined,
      `Eliminar mantenimiento ${maintenanceId}`
    );
  }

  async checkRouteReferral(type: string, id: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/referral/${type}/${id}/check`,
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async addIncome(incomeData: any) {
    return this.executeWithCache(
      'POST',
      `${environment.apiUrl}/income`,
      incomeData,
      'Agregar ingreso'
    );
  }

  async addOutcome(outcomeData: any) {
    return this.executeWithCache(
      'POST',
      `${environment.apiUrl}/outcome`,
      outcomeData,
      'Agregar egreso'
    );
  }

  async addObservation(observationData: any, type: string, id: number) {
    return this.executeWithCache(
      'PUT',
      `${environment.apiUrl}/referral/${type}/${id}`,
      observationData,
      `Agregar observación ${type}/${id}`
    );
  }

  async addTank(tankData: any) {
    return this.executeWithCache(
      'POST',
      `${environment.apiUrl}/tank`,
      tankData,
      'Agregar tanque'
    );
  }

  async addMaintenance(maintenanceData: any) {
    return this.executeWithCache(
      'POST',
      `${environment.apiUrl}/maintenance`,
      maintenanceData,
      'Agregar mantenimiento'
    );
  }


  async getAllowanceById(allowanceId: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/allowance/${allowanceId}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async getIncomeById(incomeId: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/income/${incomeId}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async getOutcomeById(outcomeId: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/outcome/${outcomeId}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async getRouteById(type: string, id: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/referral/${type}/${id}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async getTankById(tankId: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/tank/${tankId}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async getMaintenanceById(maintenanceId: number) {
    const options = await this.getHttpOptionsWithoutBody(
      'GET',
      `${environment.apiUrl}/maintenance/${maintenanceId}`
    );
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  async updateIncome(incomeId: number, incomeData: any) {
    return this.executeWithCache(
      'PATCH',
      `${environment.apiUrl}/income/${incomeId}`,
      incomeData,
      `Actualizar ingreso ${incomeId}`
    );
  }

  async updateOutcome(outcomeId: number, outcomeData: any) {
    return this.executeWithCache(
      'PATCH',
      `${environment.apiUrl}/outcome/${outcomeId}`,
      outcomeData,
      `Actualizar egreso ${outcomeId}`
    );
  }

  async updateTank(tankId: number, tankData: any) {
    return this.executeWithCache(
      'PATCH',
      `${environment.apiUrl}/tank/${tankId}`,
      tankData,
      `Actualizar tanque ${tankId}`
    );
  }

  async updateMaintenance(maintenanceId: number, maintenanceData: any) {
    return this.executeWithCache(
      'PATCH',
      `${environment.apiUrl}/maintenance/${maintenanceId}`,
      maintenanceData,
      `Actualizar mantenimiento ${maintenanceId}`
    );
  }

  async getMaintenanceByDateRange(startDate: string, endDate: string) {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/maintenance`, {
      headers,
      params: { start_date: startDate, end_date: endDate }
    }).toPromise();
  }

  async getTankByDateRange(startDate: string, endDate: string) {
    const headers = await this.getAuthHeaders();
    return this.http.get(`${environment.apiUrl}/tank`, {
      headers,
      params: { start_date: startDate, end_date: endDate }
    }).toPromise();
  }

  async searchTaxesByDescription(description: string): Promise<any> {
    return this.getTax().then((tax: any) => {
      return tax.filter((tax: any) =>
        tax.obligation_description.toLowerCase().includes(description.toLowerCase())
      );
    });
  }

  async searchTanksByDescription(description: string): Promise<any> {
    return this.getTank().then((tanks: any) => {
      return tanks.filter((tank: any) =>
        tank.tank_description.toLowerCase().includes(description.toLowerCase())
      );
    });
  }

  async searchMaintenanceByDescription(description: string): Promise<any> {
    return this.getMaintenance().then((maintenances: any) => {
      return maintenances.filter((maintenance: any) =>
        maintenance.maintenance_description.toLowerCase().includes(description.toLowerCase())
      );
    });
  }

  async uploadPhoto(photoData: { image: string, format: string }): Promise<any> {
    try {
      const response = await this.http.post(`${environment.apiUrl}/upload-image`, photoData).toPromise();
      return response;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }

  private async getAuthHeaders() {
    const token = await this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  private async getHttpOptions(method: string, url: string, data?: any) {
    const token = await this.tokenService.getToken();
    return {
      url: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data ? data : null,
    };
  }

  private async getHttpOptionsWithoutBody(method: string, url: string) {
    const token = await this.tokenService.getToken();
    return {
      url: url,
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
}
