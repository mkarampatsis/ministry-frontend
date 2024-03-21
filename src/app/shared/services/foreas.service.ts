import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IForeas } from 'src/app/shared/interfaces/foreas/foreas.interface';

const APIPREFIX_PSPED = `${environment.apiUrl}/psped/foreas`;

@Injectable({
    providedIn: 'root',
})
export class ForeasService {
    http = inject(HttpClient);

    getForeas(code: string): Observable<IForeas> {
        const url = `${APIPREFIX_PSPED}/${code}`;
        return this.http.get<IForeas>(url);
    }

    updatePoluepipedhForeas(data: IForeas): Observable<IForeas> {
        const url = `${APIPREFIX_PSPED}/${data.code}`;
        return this.http.put<IForeas>(url, data);
    }
}
