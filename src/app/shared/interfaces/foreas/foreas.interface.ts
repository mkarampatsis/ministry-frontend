import { ILegalProvision } from '../legal-provision/legal-provision.interface';

export interface IForeasDTO {
    // _id: { $oid: string };
    code: string;
    level: string;
    legalProvisions: ILegalProvision[];
}
