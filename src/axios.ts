import axios from "axios";

export const api = axios.create({
    baseURL: "https://strapi-store-server.onrender.com/api/"
})