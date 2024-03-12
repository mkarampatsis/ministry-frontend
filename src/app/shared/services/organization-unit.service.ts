import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrganizationUnitCode } from 'src/app/shared/interfaces/dictionary';
import {
    IOrganizationUnit,
    IOrganizationUnitList,
} from 'src/app/shared/interfaces/organization-unit';

const APIPREFIX_APOGRAFI = `${environment.apiUrl}/apografi`;
const APIPREFIX_PSPED = `${environment.apiUrl}/psped/monada`;

@Injectable({
    providedIn: 'root',
})
export class OrganizationUnitService {
    http = inject(HttpClient);

    getAllOrganizationUnitCodes(): Observable<IOrganizationUnitCode[]> {
        const url = `${APIPREFIX_APOGRAFI}/organizationUnit`;
        return this.http.get<IOrganizationUnitCode[]>(url);
    }

    getAllOrganizationUnits(): Observable<IOrganizationUnitList[]> {
        const url = `${APIPREFIX_PSPED}/all`;
        return this.http.get<IOrganizationUnitList[]>(url);
    }

    getOrganizationUnitDetails(code: string): Observable<IOrganizationUnit> {
        const url = `${APIPREFIX_PSPED}/${code}`;
        return this.http.get<IOrganizationUnit>(url);
    }
}
