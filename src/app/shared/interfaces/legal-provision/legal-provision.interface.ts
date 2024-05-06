import { IFek } from '../legal-act/fek.interface';
import { ILegalProvisionSpecs } from './legal-provision-specs.interface';

export interface ILegalProvision {
    legalActKey: string;
    legalProvisionSpecs: ILegalProvisionSpecs;
    legalProvisionText: string;
    legalActType: string;
    legalActTypeOther: string;
    legalActYear: string;
    ada: string;
    fek: IFek;
}
