import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = 'http://localhost:8000/api';

  constructor(private http: HttpClient, private tokenService: TokenService) {
  }

  async registerToken() {
    const token = await this.tokenService.getToken();
    return this.http.post(`${this.url}/register-token`, {
      device_token: token,
    }).toPromise();
  }
 
  // Ejemplos de métodos GET
  async getAllowance() {
    const token = await this.tokenService.getToken();
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.url}/allowance`, { headers }).toPromise();
  }

  async getIncome() {
    const token = await this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.url}/income`, { headers }).toPromise();
  }

  async getOutcome() {
    const token = await this.tokenService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.url}/outcome`, { headers }).toPromise();
  }

  // Ejemplo de método DELETE
  async deleteIncome(incomeId: number) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/income/${incomeId}/delete`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async deleteOutcome(outcomeId: number) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/outcome/${outcomeId}/delete`,
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  // Ejemplo de método POST
  async addIncome(incomeData: any) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/income`,
      method: 'POST',
      data: incomeData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  }

  async addOutcome(outcomeData: any) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/outcome`,
      method: 'POST',
      data: outcomeData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.post(options);
    return response.data;
  }

  // Ejemplos de métodos GET por ID
  async getIncomeById(incomeId: number) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/income/${incomeId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }
  
  async getOutcomeById(outcomeId: number) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/outcome/${outcomeId}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.get(options);
    return response.data;
  }

  // Ejemplos de métodos PATCH para actualización
  async updateIncome(incomeId: number, incomeData: any) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/income/${incomeId}`,
      method: 'PATCH',
      data: incomeData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }

  async updateOutcome(outcomeId: number, outcomeData: any) {
    //const token = await this.tokenService.getToken();
    const options = {
      url: `${this.url}/outcome/${outcomeId}`,
      method: 'PATCH',
      data: outcomeData,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await this.tokenService.getToken()}`
      },
    };
    const response: HttpResponse = await CapacitorHttp.put(options);
    return response.data;
  }
}
