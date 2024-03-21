import { Injectable, inject } from '@angular/core';
import { map, take } from 'rxjs';

import {
    SizeColumnsToContentStrategy,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';

import {
    IDictionaryType,
    IOrganizationCode,
    IOrganizationUnitCode,
} from 'src/app/shared/interfaces/dictionary';

import { DictionaryService } from 'src/app/shared/services/dictionary.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { OrganizationUnitService } from 'src/app/shared/services/organization-unit.service';

@Injectable({
    providedIn: 'root',
})
export class ConstService {
    dictionaryService = inject(DictionaryService);
    organizationService = inject(OrganizationService);
    organizationUnitService = inject(OrganizationUnitService);

    readonly ORGANIZATION_LEVELS = [
        'ΚΕΝΤΡΙΚΟ',
        'ΑΠΟΚΕΝΤΡΩΜΕΝΟ',
        'ΠΕΡΙΦΕΡΕΙΑΚΟ',
        'ΤΟΠΙΚΟ',
        'ΜΗ ΟΡΙΣΜΕΝΟ',
    ];

    readonly USER_ROLES = ['EDITOR', 'READER', 'ADMIN', 'ROOT'];

    readonly ACT_TYPES= [
      'Νόμος', 
      'Προεδρικό Διάταγμα', 
      'Κανονιστική Διοικητική Πράξη', 
      'Απόφαση του οργάνου διοίκησης', 
      'Άλλο'
    ]

    readonly REMIT_TYPES = [
      "Επιτελική", 
      "Εκτελεστική",
      "Υποστηρικτική",
      "Ελεγκτική",
      "Παρακολούθησης αποτελεσματικής πολιτικής και αξιολόγησης αποτελεσμάτων"
    ]

    ORGANIZATION_TYPES: IDictionaryType[] = [];
    ORGANIZATION_TYPES_MAP: Map<number, string> = new Map<number, string>();

    ORGANIZATION_UNIT_TYPES: IDictionaryType[] = [];
    ORGANIZATION_UNIT_TYPES_MAP: Map<number, string> = new Map<
        number,
        string
    >();

    ORGANIZATION_CODES: IOrganizationCode[] = [];
    ORGANIZATION_CODES_MAP: Map<string, string> = new Map<string, string>();

    ORGANIZATION_UNIT_CODES: IOrganizationUnitCode[] = [];
    ORGANIZATION_UNIT_CODES_MAP: Map<string, string> = new Map<
        string,
        string
    >();

    // AgGrid related constants
    defaultColDef = {
        resizable: true,
        filter: true,
        sortable: true,
        floatingFilter: true,
    };
    autoSizeStrategy:
        | SizeColumnsToFitGridStrategy
        | SizeColumnsToFitProvidedWidthStrategy
        | SizeColumnsToContentStrategy = { type: 'fitCellContents' };

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

        this.dictionaryService
            .getAllOrganizationUnitTypes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_UNIT_TYPES = data;
                this.ORGANIZATION_UNIT_TYPES.forEach((x) => {
                    this.ORGANIZATION_UNIT_TYPES_MAP.set(
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

        this.organizationUnitService
            .getAllOrganizationalUnitCodes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_UNIT_CODES = data;
                this.ORGANIZATION_UNIT_CODES.forEach((x) => {
                    this.ORGANIZATION_UNIT_CODES_MAP.set(
                        x.code,
                        x.preferredLabel,
                    );
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

    getOrganizationUnitPrefferedLabelByCode(code: string): string | undefined {
        return this.ORGANIZATION_UNIT_CODES.find((x) => x.code === code)
            ?.preferredLabel;
    }
}
