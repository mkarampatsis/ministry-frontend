import { Injectable, inject } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ModalService } from './modal.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    modalService = inject(ModalService);
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler,
    ): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            tap((event) => {
                if (event instanceof HttpResponse) {
                    console.log(event.body);
                }
            }),
            catchError((response: HttpErrorResponse): Observable<any> => {
                if (response.status === 403 && response.error) {
                    console.log(response.error);
                    this.modalService.showBackendError(response.error.error);
                }
                // return throwError(error);
                return throwError(() => new Error(response.error.error));
            }),
        );
    }
}
