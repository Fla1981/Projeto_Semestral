import Api from "./Api";

export async function listarTodosRecados() {
    const resposta = await Api.get("/admin/recados");
    return resposta.data;
}

export async function listarUsuarios() {
    const resposta = await Api.get("/admin/users");
    return resposta.data;
}

export async function criarUsuario(dados) {
    const resposta = await Api.post("/admin/users", dados);
    return resposta.data;
}

export async function editarUsuario(id, dados) {
    const resposta = await Api.put(`/admin/users/${id}`, dados);
    return resposta.data;
}

export async function excluirUsuario(id) {
    const resposta = await Api.delete(`/admin/users/${id}`);
    return resposta.data;
}

export async function excluirRecadoAdmin(id) {
    const resposta = await Api.delete(`/admin/recados/${id}`);
    return resposta.data;
}
