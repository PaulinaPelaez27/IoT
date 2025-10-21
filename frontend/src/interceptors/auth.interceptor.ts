import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // except login
    if (req.url.includes('/auth/login')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    const cloned = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(cloned).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && error.error?.error === 'Token expirado') {
          console.warn('Token expirado - redirection a la página de login');
          this.authService.logout();
          this.router.navigate(['/login']).then(() => {
            window.location.reload();
          });
        }

        return throwError(() => error);
      })
    );
  }
}
