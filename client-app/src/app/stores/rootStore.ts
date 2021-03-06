import ClubStore from './clubStore';
import UserStore from './userStore';
import { createContext } from 'react';
import { configure } from 'mobx';
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';

configure({ enforceActions: 'always' });

export class RootStore{
    clubStore: ClubStore;
    userStore: UserStore;
    commonStore: CommonStore
    modalStore: ModalStore
    profileStore : ProfileStore

    constructor(){
        this.clubStore = new ClubStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.profileStore = new ProfileStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());