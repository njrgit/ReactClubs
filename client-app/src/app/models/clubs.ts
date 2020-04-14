export interface IClub{
    id: string;
    name: string;
    leagueName : string;
    stadiumName : string;
    dateEstablished : Date; 
    shortName :string
}

export interface IClubFormValues extends Partial<IClub>{
    time?:Date
}

export class ClubFormValues implements IClubFormValues{
    id?: string = undefined;
    name: string = "";
    leagueName: string  = "";
    stadiumName: string = "";
    dateEstablished?: Date = undefined;
    time?: Date= undefined;
    shortName: string = "";


    constructor(init? : IClubFormValues) {
        if(init && init.dateEstablished){
            init.time = init.dateEstablished;
        }
        
        Object.assign(this, init);
    }
}