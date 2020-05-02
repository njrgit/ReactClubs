import axios, { AxiosResponse } from 'axios';
import { IClub } from '../models/clubs';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config)=>{

    const token = window.localStorage.getItem('jwt');

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, error =>{
    return Promise.reject(error);
});

axios.interceptors.response.use(undefined,error =>{

    if(error.message === 'Network Error' && !error.response){
        toast.error('Network Error - Api not running');
    }


    const {status, data, config} = error.response;

    if(status === 404){
        history.push('/notfound');
    }

    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')){
        history.push('/notfound');
    }

    if(status === 500){
        toast.error('Server Error - Chek Terminal');
        history.push('/notfound');
    }

    throw error.response;
});

//Doing a wait on the response
const sleep = (ms : number) => (response : AxiosResponse) => new Promise<AxiosResponse>(resolve => setTimeout(()=> resolve(response), ms));
const responseBody = (response : AxiosResponse) => response.data;

const requests ={
    get: (url:string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url:string, body:{}) => axios.post(url, body,).then(responseBody),
    put: (url:string, body:{}) => axios.put(url, body).then(responseBody),
    del: (url:string) => axios.delete(url).then(responseBody)
}

const Clubs = {
    list: (): Promise<IClub []> => requests.get('/clubs'),
    details: (id:string) => requests.get(`/clubs/${id}`),
    create: (club:IClub) => requests.post('/clubs',club),
    update: (club:IClub) => requests.put(`/clubs/${club.id}`,club),
    delete: (id: string) => requests.del(`/clubs/${id}`),
    attend: (id: string) => requests.post(`/clubs/${id}/attend`, {}),
    unattend: (id: string) => requests.del(`/clubs/${id}/attend`)
}

const User = {
    currentUser: (): Promise<IUser> => requests.get('/user'),
    login: (user:IUserFormValues) : Promise<IUser> => requests.post(`/user/login`, user),
    register: (user:IUserFormValues) : Promise<IUser> => requests.post(`/user/register`, user)
}

export default{
    Clubs,
    User
}