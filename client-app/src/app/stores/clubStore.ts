import {observable, action, computed, configure, runInAction} from 'mobx'
import { createContext, SyntheticEvent } from 'react';
import {IClub} from '../models/clubs';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ClubStore{

    @observable clubRegistry = new Map();
    @observable clubs : IClub [] = [];
    @observable loadingInitial = false;
    @observable selectedClub : IClub|undefined;
    @observable editMode = false;
    @observable submitting  = false;
    @observable target = "";

    @computed get clubsBydate(){
        return Array.from (this.clubRegistry.values()).sort((a,b) => Date.parse(a.dateEstablished) - Date.parse(b.dateEstablished));
    }

    @action loadClubs = async () => {
        this.loadingInitial = true;
        try {
            const clubs = await agent.Clubs.list();
            runInAction('loading clubs',() => {
                clubs.forEach((club) => {
                    club.dateEstablished = club.dateEstablished.split(".")[0];
                    this.clubRegistry.set(club.id, club);
                  });
                  this.loadingInitial = false;
            });
        } catch (error) {
            runInAction('club laoding error',()=>{
                console.log(error)
                this.loadingInitial = false;
            });
        }
    }

    @action createClub = async (club : IClub) =>{
        this.submitting = true;
        try {
           await agent.Clubs.create(club);

           runInAction('Creating club',()=>{
            this.clubRegistry.set(club.id,club);
            this.editMode = false;
            this.submitting = false;
           });
        } catch (error) {
            runInAction('Creating Club error',()=>{
            console.log(error)
            this.submitting = false;
            });
        }
    };

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedClub = undefined;
    }

    @action editExistingClub = async (club : IClub) =>{
        this.submitting = true;
        try {
            await agent.Clubs.update(club);

            runInAction('Editing Existing Club',()=>{
                this.clubRegistry.set(club.id, club);
                this.selectedClub = club;
                this.editMode = false;
                this.submitting = false;
            });
        } catch (error) {
            runInAction('Edtting Existing Club Error',()=>{
                this.submitting = false;
                console.log(error);
            });
        }
    }

    @action openEditForm = (id:string) => {
        this.selectedClub = this.clubRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedClub = () => {
        this.selectedClub = undefined;
    }

    @action cancelEditFormOpen = () => {
        this.editMode = false;
    }

    @action selectClub = (id : string) =>{
        this.selectedClub = this.clubRegistry.get(id);
        this.editMode = false;
    }
    
    @action deleteClub  = async (event: SyntheticEvent<HTMLButtonElement>,id: string) =>{
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Clubs.delete(id);
            runInAction('Deleting Club',()=>{
                this.clubRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            })
        } catch (error) {
            runInAction('Error Deleting Club',()=>{
                this.submitting = false;
                this.target = "";
            })
        }  
    }
}

export default createContext(new ClubStore())