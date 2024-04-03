import { IFek } from './fek.interface';

export interface ILegalAct {
    ada: string;
    fek: IFek;
    fileUpload: string;
    legalActDate: Date;
    legalActNumber: string;
    legalActTypeOther: string;
    legalActType: string;
}
