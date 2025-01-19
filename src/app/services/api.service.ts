import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(private http: HttpClient, private tokenService: TokenService) { }

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
    return this.http.get(`${environment.apiUrl}/vehicle/all`, {headers}).toPromise();
  }

  async deleteIncome(incomeId: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/income/${incomeId}/delete`
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async deleteOutcome(outcomeId: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/outcome/${outcomeId}/delete`
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async deleteTank(tankId: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/tank/${tankId}/delete`
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async deleteMaintenance(maintenanceId: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/maintenance/${maintenanceId}/delete`
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
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
    const options = await this.getHttpOptions(
      'POST',
      `${environment.apiUrl}/income`,
      incomeData
    );
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  }

  async addOutcome(outcomeData: any) {
    const options = await this.getHttpOptions(
      'POST',
      `${environment.apiUrl}/outcome`,
      outcomeData
    );
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  }

  async addObservation(observationData: any, type: string, id: number) {
    const options = await this.getHttpOptions(
      'PUT',
      `${environment.apiUrl}/referral/${type}/${id}`,
      observationData
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async addTank(tankData: any) {
    const options = await this.getHttpOptions(
      'POST',
      `${environment.apiUrl}/tank`,
      tankData
    );
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  }

  async addMaintenance(maintenanceData: any) {
    const options = await this.getHttpOptions(
      'POST',
      `${environment.apiUrl}/maintenance`,
      maintenanceData
    );
    const response: HttpResponse = await CapacitorHttp.post(options);
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
    const options = await this.getHttpOptions(
      'PATCH',
      `${environment.apiUrl}/income/${incomeId}`,
      incomeData
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async updateOutcome(outcomeId: number, outcomeData: any) {
    const options = await this.getHttpOptions(
      'PATCH',
      `${environment.apiUrl}/outcome/${outcomeId}`,
      outcomeData
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async updateTank(tankId: number, tankData: any) {
    const options = await this.getHttpOptions(
      'PATCH',
      `${environment.apiUrl}/tank/${tankId}`,
      tankData
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async updateMaintenance(maintenanceId: number, maintenanceData: any) {
    const options = await this.getHttpOptions(
      'PATCH',
      `${environment.apiUrl}/maintenance/${maintenanceId}`,
      maintenanceData
    );
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
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
