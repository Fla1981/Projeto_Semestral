
import Api, { ApiRaiz } from "./Api";

// Solicita o cookie CSRF antes das operações de autenticação.
export async function login(email, senha) {
    await ApiRaiz.get("/sanctum/csrf-cookie");

    const resposta = await Api.post("/login", {
        email: email,
        password: senha
    });

    return resposta.data;
}

// Solicita o cookie CSRF antes do cadastro.
export async function registrar(nome, email, senha, confirmarSenha) {
    await ApiRaiz.get("/sanctum/csrf-cookie");

    const resposta = await Api.post("/register", {
        name: nome,
        email: email,
        password: senha,
        password_confirmation: confirmarSenha
    });

    return resposta.data;
}

// Encerra a sessão autenticada.
export async function logout() {
    const resposta = await Api.post("/logout");
    return resposta.data;
}

// Consulta o usuário autenticado.
export async function buscarUsuarioLogado() {
    const resposta = await Api.get("/user");
    return resposta.data;
}
