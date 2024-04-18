import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IDiataxi } from 'src/app/shared/interfaces/legal-provision/diataxi.interface';

const APIPREFIX = `${environment.apiUrl}/legal_provision`;

@Injectable({
    providedIn: 'root',
})
export class LegalProvisionService {
    http = inject(HttpClient);

    newLegalProvision(data: IDiataxi): Observable<{ msg: string; index: IDiataxi }> {
        return this.http.post<{ msg: string; index: IDiataxi }>(APIPREFIX, data);
    }

    getAllLegalProvisions(): Observable<any[]> {
        return this.http.get<any[]>(APIPREFIX);
    }
}
