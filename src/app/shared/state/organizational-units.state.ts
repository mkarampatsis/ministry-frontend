import { createAction, props, createReducer, on, createSelector } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { inject } from '@angular/core';

import { AppState } from './app.state';
import { IOrganizationUnitList } from '../interfaces/organization-unit';
import { OrganizationalUnitService } from '../services/organizational-unit.service';
import { catchError, map, of, switchMap } from 'rxjs';

export interface OrganizationalUnitsState {
    organizationalUnits: IOrganizationUnitList[];
    loading: boolean;
    error: string;
}

export const organizationalUnitsInitialState: OrganizationalUnitsState = {
    organizationalUnits: [],
    loading: false,
    error: '',
};

// Organizational Units Actions
export const loadOrganizationalUnits = createAction('[OrganizationalUnit] Load Organizational Units');
export const loadOrganizationalUnitsSuccess = createAction(
    '[OrganizationalUnit] Load Organizational Units Success',
    props<{ organizationalUnits: IOrganizationUnitList[] }>(),
);
export const loadOrganizationalUnitsFailure = createAction(
    '[OrganizationalUnit] Load Organizational Units Failure',
    props<{ error: string }>(),
);

// Organizational Units Reducer
export const organizationalUnitsReducer = createReducer<OrganizationalUnitsState>(
    organizationalUnitsInitialState,
    on(loadOrganizationalUnits, (state) => ({ ...state, loading: true })),
    on(loadOrganizationalUnitsSuccess, (state, { organizationalUnits }) => ({
        ...state,
        organizationalUnits,
        loading: false,
    })),
    on(loadOrganizationalUnitsFailure, (state, { error }) => ({ ...state, error, loading: false })),
);

// Organizational Units Selectors
export const selectOrganizationalUnitsState$ = (state: AppState) => state.organizationalUnits;
export const organizationalUnits$ = (state: AppState) => state.organizationalUnits.organizationalUnits;
export const organizationalUnitsLoading$ = (state: AppState) => state.organizationalUnits.loading;
// Use createSelector to create memoized selectors
export const selectOrganizationalUnits$ = createSelector(
    selectOrganizationalUnitsState$,
    (state) => state.organizationalUnits,
);

// Organizational Units Effects
export const getOrganizationalUnitsEffect = createEffect(
    (actions$ = inject(Actions), organizationUnitService = inject(OrganizationalUnitService)) => {
        return actions$.pipe(
            ofType(loadOrganizationalUnits),
            switchMap(() =>
                organizationUnitService.getAllOrganizationalUnits().pipe(
                    map((organizationalUnits) => loadOrganizationalUnitsSuccess({ organizationalUnits })),
                    catchError((error) => of(loadOrganizationalUnitsFailure({ error: error.message }))),
                ),
            ),
        );
    },
    { functional: true },
);
