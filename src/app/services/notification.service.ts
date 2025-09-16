import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';

interface NotificationData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'pending' | 'uploading';
  timestamp: number;
  autoClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<NotificationData[]>([]);
  private pendingRequests = new BehaviorSubject<number>(0);
  
  notifications$ = this.notifications.asObservable();
  pendingRequests$ = this.pendingRequests.asObservable();

  constructor(private toastController: ToastController) {}

  // Agregar notificación de petición pendiente
  addPendingRequest(description: string): string {
    const id = this.generateId();
    const notification: NotificationData = {
      id,
      message: `Subiendo: ${description}`,
      type: 'uploading',
      timestamp: Date.now(),
      autoClose: false
    };

    this.addNotification(notification);
    this.updatePendingCount(1);
    return id;
  }

  // Marcar petición como exitosa
  markAsSuccess(id: string, message?: string) {
    const currentNotifications = this.notifications.value;
    const index = currentNotifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      currentNotifications[index] = {
        ...currentNotifications[index],
        message: message || currentNotifications[index].message.replace('Subiendo:', 'Completado:'),
        type: 'success',
        autoClose: true
      };
      
      this.notifications.next([...currentNotifications]);
      this.updatePendingCount(-1);
      
      // Auto-remover después de 3 segundos
      setTimeout(() => {
        this.removeNotification(id);
      }, 3000);
    }
  }

  // Marcar petición como fallida
  markAsFailed(id: string, message?: string) {
    const currentNotifications = this.notifications.value;
    const index = currentNotifications.findIndex(n => n.id === id);
    
    if (index !== -1) {
      currentNotifications[index] = {
        ...currentNotifications[index],
        message: message || currentNotifications[index].message.replace('Subiendo:', 'Error:'),
        type: 'error',
        autoClose: false
      };
      
      this.notifications.next([...currentNotifications]);
      this.updatePendingCount(-1);
    }
  }

  // Obtener si hay peticiones pendientes
  hasPendingRequests(): boolean {
    return this.pendingRequests.value > 0;
  }

  // Limpiar todas las notificaciones
  clearAll() {
    this.notifications.next([]);
    this.pendingRequests.next(0);
  }

  // Remover notificación específica
  removeNotification(id: string) {
    const currentNotifications = this.notifications.value;
    const filtered = currentNotifications.filter(n => n.id !== id);
    this.notifications.next(filtered);
  }

  // Mostrar toast para notificaciones importantes
  async showToast(message: string, type: 'success' | 'error' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'top',
      color: type === 'success' ? 'success' : type === 'error' ? 'danger' : 'warning',
      buttons: [
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });

    await toast.present();
  }

  private addNotification(notification: NotificationData) {
    const currentNotifications = this.notifications.value;
    this.notifications.next([notification, ...currentNotifications]);
  }

  private updatePendingCount(change: number) {
    const current = this.pendingRequests.value;
    this.notifications.next([...this.notifications.value]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}