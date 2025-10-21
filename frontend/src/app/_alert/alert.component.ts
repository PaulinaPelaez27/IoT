import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from './alert.service';
import { Alert, AlertType } from './alert.model';
import { Subscription } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent implements OnInit, OnDestroy {
  @Input() id = '';
  @Input() fade = true;

  alerts: Alert[] = [];
  alertSubscription!: Subscription;
  timeout: any;

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertSubscription = this.alertService.onAlert().subscribe((alert) => {
      if (!alert.message) {
        this.alerts = this.alerts.filter((x) => x.id !== alert.id);
        return;
      }

      this.alerts.push(alert);

      if (alert.autoClose) {
        setTimeout(() => this.removeAlert(alert), 3000);
      }
    });
  }

  ngOnDestroy() {
    this.alertSubscription.unsubscribe();
  }

  removeAlert(alert: Alert) {
    if (this.fade) {
      alert.fade = true;
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 250);
    } else {
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  cssClass(alert: Alert): string {
    if (!alert) return '';

    const classes = ['alert', 'alert-dismissable'];

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    if (alert.fade) {
      classes.push('fade');
    }

    if (alert.type !== undefined && alertTypeClass[alert.type]) {
      classes.push(alertTypeClass[alert.type]);
    }
    return classes.join(' ');
  }
}
