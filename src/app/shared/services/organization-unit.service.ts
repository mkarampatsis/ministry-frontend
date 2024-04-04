import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrganizationUnitCode } from 'src/app/shared/interfaces/dictionary';
import { IOrganizationUnit, IOrganizationUnitList } from 'src/app/shared/interfaces/organization-unit';

const APIPREFIX_APOGRAFI = `${environment.apiUrl}/apografi/organizationalUnit`;

@Injectable({
    providedIn: 'root',
})
export class OrganizationUnitService {
    http = inject(HttpClient);

    getAllOrganizationalUnitCodes(): Observable<IOrganizationUnitCode[]> {
        const url = `${APIPREFIX_APOGRAFI}`;
        return this.http.get<IOrganizationUnitCode[]>(url);
    }

    getAllOrganizationalUnits(): Observable<IOrganizationUnitList[]> {
        const url = `${APIPREFIX_APOGRAFI}/all`;
        return this.http.get<IOrganizationUnitList[]>(url);
    }

    getOrganizationalUnitDetails(code: string): Observable<IOrganizationUnit> {
        const url = `${APIPREFIX_APOGRAFI}/${code}`;
        return this.http.get<IOrganizationUnit>(url);
    }

    getOrganizationalUnitOrganizationCode(code: string): Observable<string> {
        const url = `${APIPREFIX_APOGRAFI}/${code}/organizationCode`;
        return this.http.get<string>(url);
    }
}
