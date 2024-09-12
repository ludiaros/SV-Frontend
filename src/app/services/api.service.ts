import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  //USER DATA
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

  // Ejemplos de métodos GET
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

  // Ejemplo de método DELETE
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

  // Ejemplo de método POST
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

  // Ejemplos de métodos GET por ID
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

  // Ejemplos de métodos PATCH para actualización
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

  // Método privado para obtener headers con token
  private async getAuthHeaders() {
    const token = await this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Método privado para obtener opciones HTTP con token y datos (si es necesario)
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

  // Método privado para obtener opciones HTTP sin cuerpo
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
