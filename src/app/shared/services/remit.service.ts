import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IRemit } from '../interfaces/remit/remit.interface';

const APIPREFIX = `${environment.apiUrl}/remit`;

@Injectable({
    providedIn: 'root',
})
export class RemitService {
    http = inject(HttpClient);

    newRemit(data: IRemit): Observable<{ msg: string; index: IRemit }> {
        return this.http.post<{ msg: string; index: IRemit }>(APIPREFIX, data);
    }

    getAllRemits(): Observable<IRemit[]> {
        return this.http.get<IRemit[]>(APIPREFIX);
    }

    count(): Observable<{ count: number }> {
        const url = `${APIPREFIX}/count`;
        return this.http.get<{ count: number }>(url);
    }
}
