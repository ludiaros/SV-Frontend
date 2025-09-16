import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { CacheService } from 'src/app/services/cache.service';

@Component({
  selector: 'app-notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss'],
  standalone: false
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  @Input() showOnlyWhenActive: boolean = false; // Opción para mostrar solo cuando hay notificaciones
  @Input() position: 'top' | 'bottom' = 'top'; // Posición del panel
  
  notifications: any[] = [];
  pendingCount = 0;
  hasPendingRequests = false;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private notificationService: NotificationService,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    // Suscribirse a notificaciones
    this.subscriptions.push(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
      })
    );

    // Suscribirse a peticiones pendientes
    this.subscriptions.push(
      this.notificationService.pendingRequests$.subscribe(count => {
        this.pendingCount = count;
        this.hasPendingRequests = count > 0 || this.cacheService.hasPendingRequests();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  shouldShowPanel(): boolean {
    if (this.showOnlyWhenActive) {
      return this.notifications.length > 0 || this.hasPendingRequests;
    }
    return true;
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'checkmark-circle';
      case 'error': return 'alert-circle';
      case 'pending': return 'time';
      case 'uploading': return 'cloud-upload';
      default: return 'information-circle';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'pending': return 'medium';
      case 'uploading': return 'warning';
      default: return 'primary';
    }
  }

  getItemColor(type: string): string {
    switch (type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'pending': return 'light';
      case 'uploading': return 'warning';
      default: return '';
    }
  }

  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }

  clearAll() {
    this.notificationService.clearAll();
  }
}