export interface IOrganization {
    code: string;
    preferredLabel: string;
    subOrganizationOf: string;
    organizationType: number;
    status: string;
}
