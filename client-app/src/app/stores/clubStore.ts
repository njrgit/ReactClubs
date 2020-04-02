import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react';
import { IClub } from '../models/clubs';
import agent from '../api/agent';


configure({ enforceActions: 'always' });

class ClubStore {

    @observable clubRegistry = new Map();
    @observable loadingInitial = false;
    @observable club: IClub | null = null;
    @observable submitting = false;
    @observable target = "";

    @computed get clubsBydate() {
        return Array.from(this.clubRegistry.values()).sort((a, b) => Date.parse(a.dateEstablished) - Date.parse(b.dateEstablished));
    }

    @action loadClubs = async () => {
        this.loadingInitial = true;
        try {
            const clubs = await agent.Clubs.list();
            runInAction('loading clubs', () => {
                clubs.forEach((club) => {
                    club.dateEstablished = club.dateEstablished.split(".")[0];
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
        } else {
            this.loadingInitial = true;
            try {
                club = await agent.Clubs.details(id);
                runInAction("getting club details", () => {
                    this.club = club;
                    this.loadingInitial = false;
                });
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
        } catch (error) {
            runInAction('Creating Club error', () => {
                console.log(error)
                this.submitting = false;
            });
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
        } catch (error) {
            runInAction('Edtting Existing Club Error', () => {
                this.submitting = false;
                console.log(error);
            });
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

export default createContext(new ClubStore())