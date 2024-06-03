// import { IFek } from '../legal-act/fek.interface';
// import { IMongoID } from '../mongo-id.interface';
import { ILegalProvisionSpecs } from './legal-provision-specs.interface';
import { IReguLatedObject } from './regulated-object.interface';

export interface ILegalProvision {
    _id: { $oid: string };
    regulatedObject?: IReguLatedObject;
    legalActKey: string;
    legalProvisionSpecs: ILegalProvisionSpecs;
    legalProvisionText: string;
    isNew?: boolean;
    // legalActType: string;
    // legalActTypeOther: string;
    // legalActYear: string;
    // ada: string;
    // fek: IFek;
}
