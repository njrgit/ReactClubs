import {observable, action, computed} from 'mobx'
import { createContext } from 'react';
import {IClub} from '../models/clubs';
import agent from '../api/agent';

class ClubStore{

    @observable clubs : IClub [] = [];
    @observable loadingInitial = false;
    @observable selectedClub : IClub|undefined;
    @observable editMode = false;
    @observable submitting  = false;

    @computed get clubsBydate(){
        return this.clubs.sort((a,b) => Date.parse(a.dateEstablished) - Date.parse(b.dateEstablished));
    }

    @action loadClubs = async () => {
        this.loadingInitial = true;
        try {
            const clubs = await agent.Clubs.list();
            clubs.forEach((club) => {
                club.dateEstablished = club.dateEstablished.split(".")[0];
                this.clubs.push(club);
              });
              this.loadingInitial = false;
        } catch (error) {
            console.log(error)
            this.loadingInitial = false;
        }
    }

    @action createClub = async (club : IClub) =>{
        this.submitting = true;
        try {
           await agent.Clubs.create(club);
            this.clubs.push(club);
            this.editMode = false;
            this.submitting = false;
        } catch (error) {
            console.log(error)
            this.submitting = false;
        }
    };


    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedClub = undefined;
    }


    @action selectClub = (id : string) =>{
        this.selectedClub = this.clubs.find( a => a.id === id);
        this.editMode = false;
    } 
}

export default createContext(new ClubStore())