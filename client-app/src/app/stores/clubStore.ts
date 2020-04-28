import { observable, action, computed, runInAction } from 'mobx'
import { SyntheticEvent } from 'react';
import { IClub } from '../models/clubs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';




export default class ClubStore {

    rootStore : RootStore;
    constructor(rootStore: RootStore){
        this.rootStore = rootStore;
    }

    @observable clubRegistry = new Map();
    @observable loadingInitial = false;
    @observable club: IClub | null = null;
    @observable submitting = false;
    @observable target = "";

    @computed get clubsBydate() {
        return this.groupClubsByDate(Array.from(this.clubRegistry.values()));
    }

    groupClubsByDate(clubs: IClub[]){
        const sortedClubs = clubs.sort(
            (a, b) => a.dateEstablished!.getTime()- b.dateEstablished!.getTime()
        )
        return Object.entries(sortedClubs.reduce((clubs, club)=>{
            const date  = club.dateEstablished.toISOString().split('T')[0];
            clubs[date] = clubs[date] ? [...clubs[date], club] : [club];
            return clubs;
        },{} as {[key:string]: IClub[]}));
    }

    @action loadClubs = async () => {
        this.loadingInitial = true;
        try {
            const clubs = await agent.Clubs.list();
            runInAction('loading clubs', () => {
                clubs.forEach((club) => {
                    club.dateEstablished = new Date(club.dateEstablished);
                    this.clubRegistry.set(club.id, club);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction('club laoding error', () => {
                console.log(error)
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
                    club.dateEstablished = new Date(club.dateEstablished);
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


    @action clearClub = () =>{
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
}
