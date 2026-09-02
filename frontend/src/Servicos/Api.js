import Axios from "axios";

const Api = Axios.create({
    baseURL: "http://127.0.0.1:8000/api"
});

export default Api;