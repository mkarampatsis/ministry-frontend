import { ILegalProvision } from '../legal-provision/legal-provision.interface';

export interface IForeas {
    _id: { $oid: string };
    code: string;
    level: string;
    legalProvisions: string[];
}
