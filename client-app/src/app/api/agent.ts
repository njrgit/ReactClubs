import axios, { AxiosResponse } from 'axios';
import { IClub } from '../models/clubs';

axios.defaults.baseURL = "http://localhost:5000/api";

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
    delete: (id:string) => requests.del(`/clubs/${id}`)
}

export default{
    Clubs
}