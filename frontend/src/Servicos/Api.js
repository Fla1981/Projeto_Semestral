 import axios from "axios";
 
// Cliente para as rotas da API: http://localhost:8000/api/...
const Api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    withXSRFToken: true,
    headers: { Accept: "application/json" }
});

 
// Cliente para rotas fora do /api (usado só para pegar o cookie CSRF)
export const ApiRaiz = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    withXSRFToken: true,
    headers: { Accept: "application/json" }
});
 
export default Api;