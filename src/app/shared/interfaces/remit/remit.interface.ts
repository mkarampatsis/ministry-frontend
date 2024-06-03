import { ILegalProvision } from '../legal-provision/legal-provision.interface';

export interface IRemit {
    _id: { $oid: string };
    regulatedObject: {
        regulatedObjectType: 'remit';
        regulatedObjectCode: string;
    };
    remitText: string;
    remitType: string;
    cofog: {
        cofog1: string;
        cofog2: string;
        cofog3: string;
    };
    legalProvisions: ILegalProvision[];
}
