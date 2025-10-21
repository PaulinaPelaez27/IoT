import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { AlertService, Alert } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alerts-data',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, MatCardModule, MatIconModule],
  templateUrl: './alerts-data.component.html',
  styleUrls: ['./alerts-data.component.css'],
})
export class AlertsDataComponent implements OnInit, OnDestroy {
  alerts$!: Observable<Alert[]>;
  user$!: Observable<User | null>;

  private destroy$ = new Subject<void>();

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private router: Router
  ) {
    this.alerts$ = this.alertService.alerts$;
    this.user$ = this.authService.user$;
  }

  ngOnInit(): void {
    this.user$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      if (user) {
        this.alertService.loadAlertsFromDB(user.companyId || 0);
      }
    });
  }

  markAllAsRead() {
    this.alertService.markAllAsRead();
  }

  goToSensor(alert: Alert) {
    this.alertService.markAlertAsRead(true, alert.id);
    this.router.navigate(['/sensor', alert.sensorId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
