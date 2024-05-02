import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const APIPREFIX_USER = `${environment.apiUrl}/user`;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    http = inject(HttpClient);

    getMyOrganizations(): Observable<{ organizations: string[]; organizational_units: string[] }> {
        const url = `${APIPREFIX_USER}/myaccesses`;
        return this.http.get<{ organizations: string[]; organizational_units: string[] }>(url);
    }
}
