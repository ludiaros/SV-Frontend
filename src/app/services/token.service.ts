import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async getToken() {
    let token = await this.storage.get('device_token');
    if (!token) {
      token = uuidv4(); // Genera un nuevo UUID
      await this.storage.set('device_token', token);
    }
    return token;
  }
}
