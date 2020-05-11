export interface IClub{
    id: string;
    name: string;
    leagueName : string;
    stadiumName : string;
    dateEstablished : Date; 
    shortName: string;
    isGoing: boolean;
    isHost: boolean;
    attendees: IAttendee[];
    comments: IComment[];

}

export interface IComment
{
    id: string;
    createdAtTime: Date;
    body: string;
    userName: string;
    displayName: string;
    image: string;
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

export interface IAttendee{
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}

export interface IProfileUpdateValues
{
    displayName: string;
    bio: string;
}