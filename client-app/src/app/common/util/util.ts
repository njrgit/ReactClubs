import { IClub, IAttendee } from "../../models/clubs";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date:Date, time:Date) =>{

    const dateString = date.toISOString().split('T')[0];
    const timeString = date.toISOString().split('T')[1];

    return new Date(dateString + ' ' + timeString);
}

export const setClubProps = (club: IClub, user: IUser) => {
    club.dateEstablished = new Date(club.dateEstablished);

    club.isGoing = club.attendees.some(a => a.username === user.userName);
    club.isHost = club.attendees.some(a => a.username === user.userName && a.isHost);

    return club;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.userName,
        image: user.image!
    }
}