import Api, { ApiRaiz } from "./Api";
 
// Pede ao Laravel o cookie XSRF-TOKEN (proteção contra CSRF)
async function pegarCsrf() {
    await ApiRaiz.get("/sanctum/csrf-cookie");
}
 
export async function login(email, senha) {
    await pegarCsrf();
 
    const resposta = await Api.post("/login", {
        email: email,
        password: senha
    });
 
    // Não guardamos nada: o cookie HttpOnly fica com o navegador
    return resposta.data;
}
 
export async function registrar(nome, email, senha, confirmarSenha) {
    await pegarCsrf();
 
    const resposta = await Api.post("/register", {
        name: nome,
        email: email,
        password: senha,
        password_confirmation: confirmarSenha
    });
 
    return resposta.data;
}
 
export async function logout() {
    await Api.post("/logout");
}
 
// Pergunta ao servidor quem está logado (401 = ninguém)
export async function buscarUsuarioLogado() {
    const resposta = await Api.get("/user");
 
    return resposta.data;
}