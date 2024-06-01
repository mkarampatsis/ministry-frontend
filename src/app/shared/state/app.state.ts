import { OrganizationalUnitsState } from './organizational-units.state';
import { OrganizationsState } from './organizations.state';

export interface AppState {
    organizations: OrganizationsState;
    organizationalUnits: OrganizationalUnitsState;
}
