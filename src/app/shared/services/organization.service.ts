import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrganizationCode } from 'src/app/shared/interfaces/dictionary/organization-code.interface';
import { Observable } from 'rxjs';
import { IOrganization } from '../interfaces/organization/organization.interface';

const APIPREFIX_APOGRAFI = `${environment.apiUrl}/apografi/organization`;
const APIPREFIX_PSPED = `${environment.apiUrl}/psped/foreas`;

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    http = inject(HttpClient);

    getAllOrganizationCodes(): Observable<IOrganizationCode[]> {
        const url = APIPREFIX_APOGRAFI;
        return this.http.get<IOrganizationCode[]>(url);
    }

    getAllOrganizations(): Observable<IOrganization[]> {
        const url = `${APIPREFIX_PSPED}/all`;
        return this.http.get<IOrganization[]>(url);
    }
}
