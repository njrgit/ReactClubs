import { observable, action, computed, runInAction, reaction, toJS } from 'mobx'
import { SyntheticEvent } from 'react';
import { IClub } from '../models/clubs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setClubProps, createAttendee } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';


const LIMIT = 2;

export default class ClubStore
{

    rootStore: RootStore;
    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;

        reaction(() =>
        
            this.predicate.keys(),
            () =>
            {
                this.page = 0;
                this.clubRegistry.clear();
                this.loadClubs();
            }
                
        )
    }

    @observable clubRegistry = new Map();
    @observable loadingInitial = false;
    @observable club: IClub | null = null;
    @observable submitting = false;
    @observable target = "";
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;

    @observable clubCount = 0;
    @observable page = 0;

    @observable predicate = new Map();

    @action setPredicate= (predicate: string, value: string | Date) => {
        this.predicate.clear();

        if (predicate !== 'all')
        {
            this.predicate.set(predicate, value);
        }
        
    }

    @computed get axiosParams()
    {
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0} `);

        this.predicate.forEach((value, key) =>
        {
            if (key === 'startDateTime')
            {
                params.append(key, value.toISOString());
            } else
            {
                params.append(key, value);
            }
        });

        return params;
    }

    @computed get totalPages()
    {
        return Math.ceil(this.clubCount / LIMIT);
    };

    @action setPage = (page: number) =>
    {
        this.page = page;
    }

    @action createHubConnection = (clubId: string) =>
    {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Trace)
            .build();

        this.hubConnection.start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() =>
            {
                console.log("Trying to join group");
                if (this.hubConnection!.state === 'Connected')
                {
                    this.hubConnection!.invoke('AddToGroup', clubId)
                }
            })
            .catch(error => console.log("Error Making Connection to Signal R ", error));

        this.hubConnection.on("ReceivedComment", comment =>
        {
            runInAction(() =>
            {
                this.club!.comments.push(comment);
            })
        })

        // this.hubConnection.on('Send', message =>
        // {
        //     toast.info(message);
        // })
    };

    @action stopHubConnection = () =>
    {
        this.hubConnection!.invoke('RemoveFromGroup', this.club!.id)
            .then(() =>
            {
                this.hubConnection!.stop();
            })
            .then(() =>
            {
                console.log("Connection Stopped")
            }).catch((error) =>
            {
                console.log(error);
            })

    }

    @action addComment = async (values: any) =>
    {
        values.clubId = this.club!.id;

        try
        {
            await this.hubConnection!.invoke("SendComment", values)
        } catch (error)
        {
            console.log(error)
        }
    }

    @computed get clubsBydate()
    {
        return this.groupClubsByDate(Array.from(this.clubRegistry.values()));
    }

    groupClubsByDate(clubs: IClub[])
    {
        const sortedClubs = clubs.sort(
            (a, b) => a.dateEstablished!.getTime() - b.dateEstablished!.getTime()
        )
        return Object.entries(sortedClubs.reduce((clubs, club) =>
        {
            const date = club.dateEstablished.toISOString().split('T')[0];
            clubs[date] = clubs[date] ? [...clubs[date], club] : [club];
            return clubs;
        }, {} as { [key: string]: IClub[] }));
    }

    @action loadClubs = async () =>
    {
        this.loadingInitial = true;
        try
        {
            const clubsEnvelope = await agent.Clubs.list(this.axiosParams);
            const {clubs,clubCount } = clubsEnvelope;
            const user = this.rootStore.userStore.user!;
            runInAction('loading clubs', () =>
            {
                clubs.forEach((club) =>
                {
                    setClubProps(club, user);
                    this.clubRegistry.set(club.id, club);
                });
                this.clubCount = clubCount;
                this.loadingInitial = false;
            });
        } catch (error)
        {
            runInAction('club laoding error', () =>
            {
                this.loadingInitial = false;
            });
        }
    }

    @action loadClub = async (id: string) =>
    {
        let club = this.getClub(id);
        if (club)
        {
            this.club = club;
            return toJS(club);
        } else
        {
            this.loadingInitial = true;
            try
            {
                club = await agent.Clubs.details(id);
                runInAction("getting club details", () =>
                {
                    setClubProps(club, this.rootStore.userStore.user!);
                    this.club = club;
                    this.clubRegistry.set(club.id, club);
                    this.loadingInitial = false;
                });
                return club;
            } catch (error)
            {

                runInAction("error when getting single club details", () =>
                {
                    console.log(error)
                    this.loadingInitial = false;
                });
            }
        }
    }

    getClub = (id: string) =>
    {
        return this.clubRegistry.get(id);
    }

    @action createClub = async (club: IClub) =>
    {
        this.submitting = true;
        try
        {
            await agent.Clubs.create(club);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            club.attendees = attendees;
            club.comments = [];
            club.isHost = true;
            runInAction('Creating club', () =>
            {
                this.clubRegistry.set(club.id, club);
                this.submitting = false;
            });
            history.push(`/clubs/${club.id}`);
        } catch (error)
        {
            runInAction('Creating Club error', () =>
            {
                console.log(error)
                this.submitting = false;
            });
            toast.error("Problem Submitting Data");
        }
    };


    @action clearClub = () =>
    {
        this.club = null;
    }


    @action editExistingClub = async (club: IClub) =>
    {
        this.submitting = true;
        try
        {
            await agent.Clubs.update(club);

            runInAction('Editing Existing Club', () =>
            {
                this.clubRegistry.set(club.id, club);
                this.club = club;
                this.submitting = false;
            });
            history.push(`/clubs/${club.id}`);
        } catch (error)
        {
            runInAction('Edtting Existing Club Error', () =>
            {
                this.submitting = false;
                console.log(error);
            });
            toast.error("Problem Submitting Data");
        }
    }


    @action deleteClub = async (event: SyntheticEvent<HTMLButtonElement>, id: string) =>
    {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try
        {
            await agent.Clubs.delete(id);
            runInAction('Deleting Club', () =>
            {
                this.clubRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            })
        } catch (error)
        {
            runInAction('Error Deleting Club', () =>
            {
                this.submitting = false;
                this.target = "";
            })
        }
    }

    @action attendClub = async () =>
    {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try
        {
            await agent.Clubs.attend(this.club!.id);
            runInAction(() =>
            {
                if (this.club)
                {
                    this.club.attendees.push(attendee);
                    this.club.isGoing = true;
                    this.clubRegistry.set(this.club.id, this.club);
                    this.loading = false;
                }
            });
        } catch (error)
        {
            runInAction(() =>
            {
                this.loading = false;
            })
            toast.error("Problem Signing Up To Clubs");
        }
    };

    @action cancelClubAttendance = async () =>
    {
        this.loading = true;
        try
        {
            await agent.Clubs.unattend(this.club!.id);
            runInAction(() =>
            {
                if (this.club)
                {
                    this.club.attendees = this.club.attendees.filter(a => a.username !== this.rootStore.userStore.user!.userName);
                    this.club.isGoing = false;
                    this.clubRegistry.set(this.club.id, this.club);
                    this.loading = false;
                }
            })
        } catch (error)
        {
            runInAction(() =>
            {
                console.log(`Cancelling Error: ${error} `);
                this.loading = false;
            });
            console.log(error)
            toast.error("Problem Cancelling Attendance");
        }
    }
}
