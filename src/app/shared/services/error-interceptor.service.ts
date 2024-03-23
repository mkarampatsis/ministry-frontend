import { Injectable, Injector, inject } from '@angular/core';
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
import { Toast, ToastService } from './toast.service';
import { ToastMessageComponent } from 'src/app/shared/components/toast-message/toast-message.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    modalService = inject(ModalService);

    toastService = inject(ToastService);

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
                    const toast: Toast = {
                        component: ToastMessageComponent,
                        inputs: { message: response.error.error },
                        classname: 'bg-danger text-light',
                        delay: 5000,
                    };
                    this.toastService.show(toast);
                }
                return throwError(() => new Error(response.error.error));
            }),
        );
    }
}
