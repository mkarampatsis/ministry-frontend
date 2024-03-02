import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IOrganizationType } from 'src/app/shared/interfaces/dictionary/organization-type.interface';
import { Observable } from 'rxjs';

const APIPREFIX = `${environment.apiUrl}/apografi/dictionary`;

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    http = inject(HttpClient);

    getAllOrganizationTypes(): Observable<IOrganizationType[]> {
        const url = `${APIPREFIX}/OrganizationTypes`;
        return this.http.get<IOrganizationType[]>(url);
    }
}
