import axios, { AxiosResponse } from 'axios';
import { IClub } from '../models/clubs';

axios.defaults.baseURL = "http://localhost:5000/api";

const responseBody = (response : AxiosResponse) => response.data;

const requests ={
    get: (url:string) => axios.get(url).then(responseBody),
    post: (url:string, body:{}) => axios.post(url, body).then(responseBody),
    put: (url:string, body:{}) => axios.put(url, body).then(responseBody),
    del: (url:string) => axios.put(url).then(responseBody)
}

const Clubs = {
    list: (): Promise<IClub []> => requests.get('/clubs'),
    details: (id:string) => requests.get(`/clubs/${id}`),
    create: (club:IClub) => requests.post('/activities/',club),
    update: (club:IClub) => requests.put(`/activities/${club.id}`,club),
    delete: (club:IClub) => requests.del(`/activities/${club.id}`)
}

export default{
    Clubs
}