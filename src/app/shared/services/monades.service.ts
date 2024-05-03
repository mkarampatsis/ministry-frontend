import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const APIPREFIX_APOGRAFI = `${environment.apiUrl}/apografi`;

@Injectable({
    providedIn: 'root',
})
export class MonadesService {
    http = inject(HttpClient);

    count(): Observable<{ count: number }> {
        const url = `${APIPREFIX_APOGRAFI}/organizationalUnit/count`;
        return this.http.get<{ count: number }>(url);
    }
}
