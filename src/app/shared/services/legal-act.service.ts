import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ILegalAct } from 'src/app/shared/interfaces/nomiki-praji/legal-act.interface';

const APIPREFIX = `${environment.apiUrl}/legal_act`;

@Injectable({
    providedIn: 'root',
})
export class LegalActService {
    http = inject(HttpClient);

    newLegalAct(data: ILegalAct): Observable<ILegalAct> {
        return this.http.post<ILegalAct>(APIPREFIX, data);
    }

    getAllLegalActs(): Observable<ILegalAct[]> {
        return this.http.get<ILegalAct[]>(APIPREFIX);
    }

    count(): Observable<{ count: number }> {
        const url = `${APIPREFIX}/count`;
        return this.http.get<{ count: number }>(url);
    }
}
