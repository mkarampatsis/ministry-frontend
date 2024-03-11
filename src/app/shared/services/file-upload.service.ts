import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const APIPREFIX = `${environment.apiUrl}`;

@Injectable({
    providedIn: 'root',
})
export class FileUploadService {
    http = inject(HttpClient);

    upload(file: File): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${APIPREFIX}/upload`, formData, {
            reportProgress: true,
            responseType: 'json',
        });

        return this.http.request(req);
    }

    getFiles(): Observable<any> {
        return this.http.get(`${APIPREFIX}/upload/getfiles`);
    }
}
