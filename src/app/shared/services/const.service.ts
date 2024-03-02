import { Injectable, inject } from '@angular/core';
import { map, take } from 'rxjs';

import { IOrganizationType } from 'src/app/shared/interfaces/dictionary/organization-type.interface';
import { IOrganizationCode } from '../interfaces/dictionary/organization-code.interface';

import { DictionaryService } from './dictionary.service';
import { OrganizationService } from './organization.service';

@Injectable({
    providedIn: 'root',
})
export class ConstService {
    dictionaryService = inject(DictionaryService);
    organizationService = inject(OrganizationService);

    ORGANIZATION_TYPES: IOrganizationType[] = [];
    ORGANIZATION_TYPES_MAP: Map<number, string> = new Map<number, string>();

    ORGANIZATION_CODES: IOrganizationCode[] = [];
    ORGANIZATION_CODES_MAP: Map<string, string> = new Map<string, string>();

    constructor() {
        this.dictionaryService
            .getAllOrganizationTypes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_TYPES = data;
                this.ORGANIZATION_TYPES.forEach((x) => {
                    this.ORGANIZATION_TYPES_MAP.set(
                        x.apografi_id,
                        x.description,
                    );
                });
            });

        this.organizationService
            .getAllOrganizationCodes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_CODES = data;
                this.ORGANIZATION_CODES.forEach((x) => {
                    this.ORGANIZATION_CODES_MAP.set(x.code, x.preferredLabel);
                });
            });
    }

    getOrganizationTypeById(id: number): string | undefined {
        return this.ORGANIZATION_TYPES.find((x) => x.apografi_id === id)
            ?.description;
    }

    getOrganizationPrefferedLabelByCode(code: string): string | undefined {
        return this.ORGANIZATION_CODES.find((x) => x.code === code)
            ?.preferredLabel;
    }
}
