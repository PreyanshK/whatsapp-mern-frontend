import axios from "axios";

const instance = axios.create({
    // baseURL: "http://localhost:9000"
    baseURL: "https://whatsapp-mern-backend-1.herokuapp.com"
})

export default instance;