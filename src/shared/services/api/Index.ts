import axios from "axios";

const Api = axios.create({
    baseURL: 'https://cppu-api.vercel.app/'
})

export {Api}
