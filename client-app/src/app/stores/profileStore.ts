import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed, reaction } from "mobx";
import { IProfile, IPhoto } from "../models/profile";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { IProfileUpdateValues } from "../models/clubs";

export default class ProfileStore
{
    rootStore: RootStore;
    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4)
                {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(predicate);
                } else
                {
                    this.followings = [];
                }
            }
        )
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;

    @observable followings: IProfile[] = [];
    @observable activeTab: number=0;

    @observable loadingUpdatingProfileInformation = false;
    @observable submittingUpdatedProfileInfoLoading = false;

    @computed get isCurrentUser()
    {
        if (this.rootStore.userStore.user && this.profile)
        {
            return this.rootStore.userStore.user.userName === this.profile.userName;
        } else
        {
            return false;
        }
    }

    @action setActiveTab = (activeTabIndex: number) =>
    {
        this.activeTab = activeTabIndex;
    }

    @action loadProfile = async (username: string) =>
{
        this.loadingProfile = true;
        try
        {
            const profile = await agent.Profiles.get(username);
            runInAction(() =>
            {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error)
        {
            runInAction(() =>
            {
                this.loadingProfile = false;
            });
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) =>
    {
        this.uploadingPhoto = true;

        try
        {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() =>
            {
                if (this.profile)
                {
                    this.profile.photos.push(photo);

                    if (photo.isMain && this.rootStore.userStore.user)
                    {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })

        } catch (error)
        {
            console.log(error);
            toast.error("Problem Uplaoding Photo");
            runInAction(() =>
            {
                this.uploadingPhoto = false;
            })
        }
    }

    @action setMainPhoto = async (photo: IPhoto) =>
    {
        this.loading = true;

        try
        {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() =>
            {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error)
        {
            toast.error("Problem Setting Photo as Main");
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }

    @action deletePhoto = async (photo: IPhoto) =>
    {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch (error) {
            toast.error("Problem Deleting the Photo");
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action updateProfileInformation = async (profileInformation: IProfileUpdateValues) =>
    {
        this.submittingUpdatedProfileInfoLoading = true;

        try
        {
            await agent.Profiles.editProfile(profileInformation);
            runInAction(() =>
            {
                this.profile!.displayName = profileInformation.displayName;
                this.rootStore.userStore.user!.displayName = profileInformation.displayName;
                this.profile!.bio = profileInformation.bio;
                this.submittingUpdatedProfileInfoLoading = false;
            })
            
        } catch (error) {
            toast.error("Problem Updating Profile Information");
            runInAction(() =>
            {
                this.submittingUpdatedProfileInfoLoading = false;
            })
        }
    }

    @action follow = async (userName: string) =>
    {
        this.loading = true;

        try
        {
            await agent.Profiles.follow(userName);
            runInAction(() =>
            {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
            });
            
        } catch (error) {
            toast.error("Problem Following User");
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }

    @action unfollow = async (userName: string) =>
    {
        this.loading = true;

        try
        {
            await agent.Profiles.unfollow(userName);
            runInAction(() =>
            {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.loading = false;
            });

        } catch (error)
        {
            toast.error("Problem un-following User");
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }

    @action loadFollowings = async (predicate: string) =>
    {
        this.loading = true;

        try
        {
            console.log(predicate);
            const profiles = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            console.log(profiles);
            runInAction(() =>
            {
                this.followings = profiles;
                this.loading = false;
            })
        } catch (error) {
            toast.error("Problem Loading Followings");
            runInAction(() =>
            {
                this.loading = false;
            })
        }
    }
}