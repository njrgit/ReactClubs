import { observable, action, computed, runInAction } from 'mobx'
import { SyntheticEvent } from 'react';
import { IClub } from '../models/clubs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setClubProps, createAttendee } from '../common/util/util';




export default class ClubStore {

    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable clubRegistry = new Map();
    @observable loadingInitial = false;
    @observable club: IClub | null = null;
    @observable submitting = false;
    @observable target = "";
    @observable loading = false;

    @computed get clubsBydate() {
        return this.groupClubsByDate(Array.from(this.clubRegistry.values()));
    }

    groupClubsByDate(clubs: IClub[]) {
        const sortedClubs = clubs.sort(
            (a, b) => a.dateEstablished!.getTime() - b.dateEstablished!.getTime()
        )
        return Object.entries(sortedClubs.reduce((clubs, club) => {
            const date = club.dateEstablished.toISOString().split('T')[0];
            clubs[date] = clubs[date] ? [...clubs[date], club] : [club];
            return clubs;
        }, {} as { [key: string]: IClub[] }));
    }

    @action loadClubs = async () => {
        this.loadingInitial = true;
        try {
            const clubs = await agent.Clubs.list();
            const user = this.rootStore.userStore.user!;
            runInAction('loading clubs', () => {
                clubs.forEach((club) => {
                    setClubProps(club, user);
                    this.clubRegistry.set(club.id, club);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction('club laoding error', () => {
                this.loadingInitial = false;
            });
        }
    }

    @action loadClub = async (id: string) => {
        let club = this.getClub(id);
        if (club) {
            this.club = club;
            return club;
        } else {
            this.loadingInitial = true;
            try {
                club = await agent.Clubs.details(id);
                runInAction("getting club details", () => {
                    setClubProps(club, this.rootStore.userStore.user!);
                    this.club = club;
                    this.clubRegistry.set(club.id, club);
                    this.loadingInitial = false;
                });
                return club;
            } catch (error) {

                runInAction("error when getting single club details", () => {
                    console.log(error)
                    this.loadingInitial = false;
                });
            }
        }
    }

    getClub = (id: string) => {
        return this.clubRegistry.get(id);
    }

    @action createClub = async (club: IClub) => {
        this.submitting = true;
        try {
            await agent.Clubs.create(club);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            club.attendees = attendees;
            club.isHost = true;
            runInAction('Creating club', () => {
                this.clubRegistry.set(club.id, club);
                this.submitting = false;
            });
            history.push(`/clubs/${club.id}`);
        } catch (error) {
            runInAction('Creating Club error', () => {
                console.log(error)
                this.submitting = false;
            });
            toast.error("Problem Submitting Data");
        }
    };


    @action clearClub = () => {
        this.club = null;
    }


    @action editExistingClub = async (club: IClub) => {
        this.submitting = true;
        try {
            await agent.Clubs.update(club);

            runInAction('Editing Existing Club', () => {
                this.clubRegistry.set(club.id, club);
                this.club = club;
                this.submitting = false;
            });
            history.push(`/clubs/${club.id}`);
        } catch (error) {
            runInAction('Edtting Existing Club Error', () => {
                this.submitting = false;
                console.log(error);
            });
            toast.error("Problem Submitting Data");
        }
    }


    @action deleteClub = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Clubs.delete(id);
            runInAction('Deleting Club', () => {
                this.clubRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            })
        } catch (error) {
            runInAction('Error Deleting Club', () => {
                this.submitting = false;
                this.target = "";
            })
        }
    }

    @action attendClub = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Clubs.attend(this.club!.id);
            runInAction(() => {
                if (this.club) {
                    this.club.attendees.push(attendee);
                    this.club.isGoing = true;
                    this.clubRegistry.set(this.club.id, this.club);
                    this.loading = false;
                }
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error("Problem Signing Up To Clubs");
        }
    };

    @action cancelClubAttendance = async () => {
        this.loading = true;
        try {
            await agent.Clubs.unattend(this.club!.id);
            runInAction(() => {
                if (this.club) {
                    this.club.attendees = this.club.attendees.filter(a => a.username !== this.rootStore.userStore.user!.userName);
                    this.club.isGoing = false;
                    this.clubRegistry.set(this.club.id, this.club);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                console.log(`Cancelling Error: ${error} `);
                this.loading = false;
            });
            console.log(error)
            toast.error("Problem Cancelling Attendance");
        }
    }
}
