import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5222",
});

export default api;