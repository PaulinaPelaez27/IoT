import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { GeneralService } from './general.service';

export interface Alert {
  id: number;
  sensorId: number;
  message: string;
  level: 'warning' | 'critical';
  createdAt: Date;
  isRead?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$ = this.alertsSubject.asObservable();

  private alertsLoadedSubject = new BehaviorSubject<boolean>(false);
  public alertsLoaded$ = this.alertsLoadedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private generalService: GeneralService
  ) {
    this.initSSE();
  }

  private initSSE() {
    if (typeof window !== 'undefined') {
      const eventSource = new EventSource('http://localhost:3000/sse/alerts');

      eventSource.onmessage = (event) => {
        const alert: Alert = JSON.parse(event.data);
        alert.isRead = false;
        alert.createdAt = new Date(alert.createdAt);

        const current = this.alertsSubject.value;
        const alreadyExists = current.some(
          (a) =>
            a.sensorId === alert.sensorId &&
            a.message === alert.message &&
            new Date(a.createdAt).getTime() === alert.createdAt.getTime()
        );

        if (!alreadyExists) {
          this.alertsSubject.next([alert, ...current]);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Erreur SSE', error);
      };
    }
  }

  loadAlertsFromDB(companyId: number) {
    this.generalService
      .getData(`alerts/company/${companyId}`)
      .subscribe((alerts) => {
        this.alertsSubject.next(alerts);
      });
  }

  markAllAsRead() {
    this.generalService.postData('alerts/mark-all-read', {}).subscribe(() => {
      const updated = this.alertsSubject.value.map((a) => ({
        ...a,
        isRead: true,
      }));
      this.alertsSubject.next(updated);
    });
  }

  markAlertAsRead(isRead: boolean, alertId: number) {
    this.generalService
      .postData(`alerts/mark-read/${isRead}/${alertId}`, {})
      .subscribe(() => {
        const updated = this.alertsSubject.value.map((a) =>
          a.id === alertId ? { ...a, isRead } : a
        );
        this.alertsSubject.next(updated);
      });
  }

  getUnreadCount$() {
    return this.alerts$.pipe(
      map((alerts) => alerts.filter((a) => !a.isRead).length)
    );
  }

  getHasCritical$() {
    return this.alerts$.pipe(
      map((alerts) => alerts.some((a) => a.level === 'critical' && !a.isRead))
    );
  }
}
