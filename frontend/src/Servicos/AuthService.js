import Api from "./Api";

const URL_CSRF = "http://localhost:8000/sanctum/csrf-cookie";

export async function login(email, senha) {
    await Api.get(URL_CSRF);

    const resposta = await Api.post("/login", {
        email: email,
        password: senha
    });

    return resposta.data;
}

export async function registrar(nome, email, senha, confirmarSenha) {
    await Api.get(URL_CSRF);

    const resposta = await Api.post("/register", {
        name: nome,
        email: email,
        password: senha,
        password_confirmation: confirmarSenha
    });

    return resposta.data;
}

export async function logout() {
    const resposta = await Api.post("/logout");
    return resposta.data;
}

export async function buscarUsuarioLogado() {
    const resposta = await Api.get("/user");
    return resposta.data;
}
