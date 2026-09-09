import Axios from "axios";

const Api = Axios.create({
    baseURL: "http://127.0.0.1:8000/api"
});
// Adiciona um interceptor para incluir o token de autenticação em todas as requisições
Api.interceptors.request.use((config) => {
    // Recupera o token de autenticação do armazenamento local (localStorage)
    const token = localStorage.getItem("token");
    if (token) {
        //envia o token de autenticação no cabeçalho Authorization da requisição
        //identicar o usuário que está fazendo a requisição
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default Api;