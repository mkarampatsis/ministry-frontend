import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ILegalProvision } from 'src/app/shared/interfaces/legal-provision/legal-provision.interface';

const APIPREFIX = `${environment.apiUrl}/legal_provision`;

@Injectable({
    providedIn: 'root',
})
export class LegalProvisionService {
    http = inject(HttpClient);

    newLegalProvision(data: ILegalProvision): Observable<{ msg: string; index: ILegalProvision }> {
        return this.http.post<{ msg: string; index: ILegalProvision }>(APIPREFIX, data);
    }

    getAllLegalProvisions(): Observable<any[]> {
        return this.http.get<any[]>(APIPREFIX);
    }
}
