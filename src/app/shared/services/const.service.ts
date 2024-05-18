import { Injectable, inject } from '@angular/core';
import { take } from 'rxjs';

import {
    ColDef,
    RowClassRules,
    SizeColumnsToContentStrategy,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';

import { IDictionaryType, IOrganizationCode, IOrganizationUnitCode } from 'src/app/shared/interfaces/dictionary';

import { DictionaryService } from 'src/app/shared/services/dictionary.service';
import { OrganizationService } from 'src/app/shared/services/organization.service';
import { OrganizationalUnitService } from 'src/app/shared/services/organizational-unit.service';
import { CofogService } from 'src/app/shared/services/cofog.service';
import { ICofog } from '../interfaces/cofog/cofog.interface';
import { LegalProvisionsActionsComponent } from '../components/legal-provisions-actions/legal-provisions-actions.component';
import { LegalActsActionsComponent } from '../components/legal-acts-actions/legal-acts-actions.component';
import { ForeisActionIconsComponent } from '../components/foreis-action-icons/foreis-action-icons.component';

@Injectable({
    providedIn: 'root',
})
export class ConstService {
    dictionaryService = inject(DictionaryService);
    organizationService = inject(OrganizationService);
    organizationUnitService = inject(OrganizationalUnitService);
    cofogService = inject(CofogService);

    readonly ORGANIZATION_LEVELS = ['ΚΕΝΤΡΙΚΟ', 'ΑΠΟΚΕΝΤΡΩΜΕΝΟ', 'ΠΕΡΙΦΕΡΕΙΑΚΟ', 'ΤΟΠΙΚΟ', 'ΜΗ ΟΡΙΣΜΕΝΟ'];

    readonly USER_ROLES = ['EDITOR', 'READER', 'ADMIN', 'ROOT'];

    readonly ACT_TYPES = [
        'ΝΟΜΟΣ',
        'ΠΡΟΕΔΡΙΚΟ ΔΙΑΤΑΓΜΑ',
        'ΚΑΝΟΝΙΣΤΙΚΗ ΔΙΟΙΚΗΤΙΚΗ ΠΡΑΞΗ',
        'ΑΠΟΦΑΣΗ ΤΟΥ ΟΡΓΑΝΟΥ ΔΙΟΙΚΗΣΗΣ',
        'ΑΛΛΟ',
    ];

    readonly REMIT_TYPES = [
        'ΕΠΙΤΕΛΙΚΗ',
        'ΕΚΤΕΛΕΣΤΙΚΗ',
        'ΥΠΟΣΤΗΡΙΚΤΙΚΗ',
        'ΕΛΕΓΚΤΙΚΗ',
        'ΠΑΡΑΚΟΛΟΥΘΗΣΗΣ ΑΠΟΤΕΛΕΣΜΑΤΙΚΗΣ ΠΟΛΙΤΙΚΗΣ ΚΑΙ ΑΞΙΟΛΟΓΗΣΗΣ ΑΠΟΤΕΛΕΣΜΑΤΩΝ',
    ];

    ORGANIZATION_TYPES: IDictionaryType[] = [];
    ORGANIZATION_TYPES_MAP: Map<number, string> = new Map<number, string>();

    ORGANIZATION_UNIT_TYPES: IDictionaryType[] = [];
    ORGANIZATION_UNIT_TYPES_MAP: Map<number, string> = new Map<number, string>();

    ORGANIZATION_CODES: IOrganizationCode[] = [];
    ORGANIZATION_CODES_MAP: Map<string, string> = new Map<string, string>();

    ORGANIZATION_UNIT_CODES: IOrganizationUnitCode[] = [];
    ORGANIZATION_UNIT_CODES_MAP: Map<string, string> = new Map<string, string>();

    COFOG: ICofog[] = [];

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

    ORGANIZATIONS_COL_DEFS: ColDef[] = [
        { field: 'code', headerName: 'Κωδικός', flex: 1 },
        { field: 'preferredLabel', headerName: 'Ονομασία', flex: 4 },
        { field: 'subOrganizationOf', headerName: 'Εποπτεύουσα Αρχή', flex: 2 },
        { field: 'organizationType', headerName: 'Τύπος', flex: 2 },
        {
            field: 'actionCell',
            headerName: '',
            cellRenderer: ForeisActionIconsComponent,
            filter: false,
            sortable: false,
            floatingFilter: false,
            flex: 1,
            resizable: false,
        },
    ];

    LEGAL_ACTS_COL_DEFS: ColDef[] = [
        {
            valueGetter: function (params) {
                if (params.data.legalActType === 'ΑΛΛΟ') {
                    return params.data.legalActTypeOther;
                } else {
                    return params.data.legalActType;
                }
            },
            field: 'legalActType',
            headerName: 'Τύπος',
            flex: 3,
        },
        { field: 'legalActNumber', headerName: 'Αριθμός', flex: 1 },
        {
            valueGetter: function (params) {
                if (params.data.fek.number.startsWith('ΜΗ ΔΗΜΟΣΙΕΥΤΕΑ ΠΡΑΞΗ-')) {
                    return params.data.fek.number.split('-', 2)[0];
                } else {
                    return params.data.fek.number;
                }
            },
            field: 'fek.number',
            headerName: 'ΦΕΚ (Αριθμός)',
            flex: 1,
        },
        { field: 'fek.issue', headerName: 'ΦΕΚ (Τεύχος)', flex: 1 },
        { field: 'fek.date', headerName: 'ΦΕΚ (Ημερομηνία)', flex: 1 },
        { field: 'legalActDateOrYear', headerName: 'Έτος ή Ημερομηνία', flex: 1 },
        {
            valueGetter: function (params) {
                if (params.data.ada.startsWith('ΜΗ ΑΝΑΡΤΗΤΕΑ ΠΡΑΞΗ-')) {
                    return params.data.ada.split('-', 2)[0];
                } else {
                    return params.data.ada;
                }
            },
            field: 'ada',
            headerName: 'ΑΔΑ',
            flex: 1,
        },
        {
            field: 'actionCell',
            headerName: 'Ενέργειες',
            cellRenderer: LegalActsActionsComponent,
            filter: false,
            sortable: false,
            floatingFilter: false,
            flex: 0.5,
            resizable: false,
        },
    ];

    LEGAL_PROVISIONS_COL_DEFS: ColDef[] = [
        {
            valueGetter: function (params) {
                if (params.data.legalActType === 'ΑΛΛΟ') {
                    return params.data.legalActTypeOther;
                } else {
                    return params.data.legalActType;
                }
            },
            field: 'legalActType',
            headerName: 'Πράξη',
            flex: 1,
        },
        { field: 'legalActNumber', headerName: 'Αριθμός', flex: 1 },
        { field: 'legalActYear', headerName: 'Έτος', flex: 1 },
        { field: 'fek.number', headerName: 'ΦΕΚ (Αριθμός)', flex: 1 },
        { field: 'fek.issue', headerName: 'ΦΕΚ (Τεύχος)', flex: 1 },
        { field: 'fek.date', headerName: 'ΦΕΚ (Ημερομηνία)', flex: 1 },
        { field: 'legalProvisionSpecs.meros', headerName: 'Μέρος', flex: 1 },
        { field: 'legalProvisionSpecs.arthro', headerName: 'Άρθρο', flex: 1 },
        { field: 'legalProvisionSpecs.paragrafos', headerName: 'Παράγραφος', flex: 1 },
        { field: 'legalProvisionSpecs.edafio', headerName: 'Εδάφιο', flex: 1 },
        { field: 'legalProvisionSpecs.pararthma', headerName: 'Παράρτημα', flex: 1 },
        {
            field: 'actionCell',
            headerName: 'Ενέργειες',
            cellRenderer: LegalProvisionsActionsComponent,
            filter: false,
            sortable: false,
            floatingFilter: false,
            resizable: false,
            flex: 0.5,
        },
    ];

    LEGAL_PROVISIONS_ROW_CLASS_RULES: RowClassRules = {
        'rag-red-outer': (params: any) => {
            return !params.data.regulatedObject;
        },
    };

    constructor() {
        this.dictionaryService
            .getAllOrganizationTypes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_TYPES = data;
                this.ORGANIZATION_TYPES.forEach((x) => {
                    this.ORGANIZATION_TYPES_MAP.set(x.apografi_id, x.description);
                });
            });

        this.dictionaryService
            .getAllOrganizationUnitTypes()
            .pipe(take(1))
            .subscribe((data) => {
                this.ORGANIZATION_UNIT_TYPES = data;
                this.ORGANIZATION_UNIT_TYPES.forEach((x) => {
                    this.ORGANIZATION_UNIT_TYPES_MAP.set(x.apografi_id, x.description);
                });
            });

        this.cofogService
            .getCofog()
            .pipe(take(1))
            .subscribe((data) => {
                this.COFOG = data;
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
                    this.ORGANIZATION_UNIT_CODES_MAP.set(x.code, x.preferredLabel);
                });
            });
    }

    getOrganizationTypeById(id: number): string | undefined {
        return this.ORGANIZATION_TYPES.find((x) => x.apografi_id === id)?.description;
    }

    getOrganizationPrefferedLabelByCode(code: string): string | undefined {
        return this.ORGANIZATION_CODES.find((x) => x.code === code)?.preferredLabel;
    }

    getOrganizationUnitPrefferedLabelByCode(code: string): string | undefined {
        return this.ORGANIZATION_UNIT_CODES.find((x) => x.code === code)?.preferredLabel;
    }

    getCofogNames(cofog1Code: string, cofog2Code: string, cofog3Code: string): string[] | null {
        const cofog1 = this.COFOG.find((cofog) => cofog.code === cofog1Code);
        if (!cofog1) return null;

        const cofog2 = cofog1.cofog2.find((cofog) => cofog.code === cofog2Code);
        if (!cofog2) return null;

        const cofog3 = cofog2.cofog3.find((cofog) => cofog.code === cofog3Code);
        if (!cofog3) return null;

        return [cofog1.name, cofog2.name, cofog3.name];
    }
}
