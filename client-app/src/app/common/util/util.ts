import { IClub, IAttendee } from "../../models/clubs";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date:Date, time:Date) =>{
    const timeString  = time.getHours() + ':' + time.getMinutes() + ':00';

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const dateString = `${year}-${month}-${day}`;


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