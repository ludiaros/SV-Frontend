import { Injectable } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { CacheService } from './cache.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UploadStatusService {
  
  constructor(
    private cacheService: CacheService,
    private notificationService: NotificationService
  ) {}

  // Obtener estado de subida para un elemento específico
  getUploadStatus(method: string, url: string, data?: any): Observable<'none' | 'uploading' | 'success' | 'failed'> {
    return this.cacheService.getCacheObservable().pipe(
      map(cachedRequests => {
        const request = cachedRequests.find(req => 
          req.method === method && 
          req.url === url && 
          JSON.stringify(req.data) === JSON.stringify(data)
        );
        
        if (!request) return 'none';
        
        switch (request.status) {
          case 'pending':
          case 'uploading':
            return 'uploading';
          case 'success':
            return 'success';
          case 'failed':
            return 'failed';
          default:
            return 'none';
        }
      })
    );
  }

  // Verificar si hay peticiones subiendo
  hasUploadingRequests(): Observable<boolean> {
    return combineLatest([
      this.cacheService.getCacheObservable(),
      this.notificationService.pendingRequests$
    ]).pipe(
      map(([cachedRequests, pendingCount]) => {
        const hasUploading = cachedRequests.some(req => 
          req.status === 'uploading' || req.status === 'pending'
        );
        return hasUploading || pendingCount > 0;
      })
    );
  }

  // Obtener ícono según el estado
  getStatusIcon(status: 'none' | 'uploading' | 'success' | 'failed'): string {
    switch (status) {
      case 'uploading':
        return 'cloud-upload';
      case 'success':
        return 'checkmark-circle';
      case 'failed':
        return 'alert-circle';
      default:
        return '';
    }
  }

  // Obtener color según el estado
  getStatusColor(status: 'none' | 'uploading' | 'success' | 'failed'): string {
    switch (status) {
      case 'uploading':
        return 'warning';
      case 'success':
        return 'success';
      case 'failed':
        return 'danger';
      default:
        return 'medium';
    }
  }
}