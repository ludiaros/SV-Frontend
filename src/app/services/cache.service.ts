import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { BehaviorSubject, Observable } from 'rxjs';

interface CachedRequest {
  id: string;
  notificationId: string;
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  data?: any;
  timestamp: number;
  retryCount: number;
  description: string;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  nextRetryAt?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private memoryCache: CachedRequest[] = [];
  private retryInProgress = false;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 60000; // 1 minuto en milisegundos

  // Observable para el estado de las peticiones
  private cacheSubject = new BehaviorSubject<CachedRequest[]>([]);
  public cache$ = this.cacheSubject.asObservable();

  constructor(
    private storage: Storage,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.storage.create();
    this.loadCacheFromStorage();
    this.startRetryLoop();
  }

  // Cargar caché desde almacenamiento persistente al iniciar
  private async loadCacheFromStorage() {
    try {
      const storedCache = await this.storage.get('failed_requests');
      if (storedCache) {
        this.memoryCache = JSON.parse(storedCache);
        // Restaurar notificaciones pendientes
        this.memoryCache.forEach(request => {
          if (request.status === 'pending' || request.status === 'uploading') {
            request.notificationId = this.notificationService.addPendingRequest(request.description);
          }
        });
        this.updateCacheSubject();
      }
    } catch (error) {
      console.error('Error loading cache from storage:', error);
    }
  }

  // Guardar caché en almacenamiento persistente
  private async saveCacheToStorage() {
    try {
      await this.storage.set('failed_requests', JSON.stringify(this.memoryCache));
      this.updateCacheSubject();
    } catch (error) {
      console.error('Error saving cache to storage:', error);
    }
  }

  // Actualizar el observable
  private updateCacheSubject() {
    this.cacheSubject.next([...this.memoryCache]);
  }

  // Agregar petición fallida al caché
  async addFailedRequest(
    method: 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    description: string = 'Petición fallida'
  ) {
    const notificationId = this.notificationService.addPendingRequest(description);
    
    const request: CachedRequest = {
      id: this.generateId(),
      notificationId,
      method,
      url,
      data,
      timestamp: Date.now(),
      retryCount: 0,
      description,
      status: 'pending',
      nextRetryAt: Date.now() + this.RETRY_DELAY
    };

    this.memoryCache.push(request);
    await this.saveCacheToStorage();
    console.log(`Petición guardada en caché: ${description}`);
  }

  // Obtener peticiones por estado
  getPendingRequests(): CachedRequest[] {
    return this.memoryCache.filter(req => req.status === 'pending' || req.status === 'uploading');
  }

  // Obtener peticiones por ID específico (para mostrar íconos)
  getRequestStatus(method: string, url: string, data?: any): 'none' | 'uploading' | 'success' | 'failed' {
    const request = this.memoryCache.find(req => 
      req.method === method && 
      req.url === url && 
      JSON.stringify(req.data) === JSON.stringify(data)
    );
    
    if (!request) return 'none';
    return request.status === 'pending' || request.status === 'uploading' ? 'uploading' : request.status;
  }

  // Eliminar petición del caché
  async removeFromCache(id: string) {
    this.memoryCache = this.memoryCache.filter(req => req.id !== id);
    await this.saveCacheToStorage();
  }

  // Limpiar todo el caché
  async clearCache() {
    this.memoryCache = [];
    await this.saveCacheToStorage();
    this.notificationService.clearAll();
  }

  // Verificar si hay peticiones pendientes
  hasPendingRequests(): boolean {
    return this.getPendingRequests().length > 0;
  }

  // Obtener observable del caché
  getCacheObservable(): Observable<CachedRequest[]> {
    return this.cache$;
  }

  // Reintentar peticiones fallidas
  private startRetryLoop() {
    setInterval(async () => {
      if (!this.retryInProgress) {
        await this.retryFailedRequests();
      }
    }, 10000); // Revisar cada 10 segundos si hay peticiones listas para reintentar
  }

  private async retryFailedRequests() {
    this.retryInProgress = true;
    const now = Date.now();
    
    const requestsToRetry = this.memoryCache.filter(req => 
      req.status === 'pending' && 
      req.nextRetryAt && 
      req.nextRetryAt <= now &&
      req.retryCount < this.MAX_RETRIES
    );

    for (const request of requestsToRetry) {
      try {
        request.status = 'uploading';
        await this.saveCacheToStorage();
        
        await this.executeRequest(request);
        
        // Petición exitosa
        request.status = 'success';
        await this.removeFromCache(request.id);
        this.notificationService.markAsSuccess(request.notificationId, `${request.description} - Completado`);
        console.log(`Petición exitosa después de reintentar: ${request.description}`);
        
      } catch (error) {
        request.retryCount++;
        request.status = 'pending';
        
        if (request.retryCount >= this.MAX_RETRIES) {
          request.status = 'failed';
          this.notificationService.markAsFailed(request.notificationId, `${request.description} - Falló después de ${this.MAX_RETRIES} intentos`);
          console.error(`Petición falló después de ${this.MAX_RETRIES} intentos: ${request.description}`);
        } else {
          // Programar próximo intento
          request.nextRetryAt = Date.now() + this.RETRY_DELAY;
          this.notificationService.markAsFailed(request.notificationId, `${request.description} - Intento ${request.retryCount}/${this.MAX_RETRIES}, próximo intento en 1 minuto`);
        }
        
        await this.saveCacheToStorage();
      }
    }
    
    this.retryInProgress = false;
  }

  private async executeRequest(request: CachedRequest) {
    const token = await (this.apiService as any).tokenService.getToken();
    
    const options = {
      url: request.url,
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: request.data
    };

    const { CapacitorHttp } = await import('@capacitor/core');
    
    switch (request.method) {
      case 'POST':
        return await CapacitorHttp.post(options);
      case 'PUT':
        return await CapacitorHttp.put(options);
      case 'DELETE':
        return await CapacitorHttp.delete(options);
      case 'PATCH':
        return await CapacitorHttp.patch(options);
      default:
        throw new Error(`Método HTTP no soportado: ${request.method}`);
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}