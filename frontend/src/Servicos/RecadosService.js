import Api from "./Api";

export async function listarRecados() {
    const resposta = await Api.get("/recados");

    return resposta.data;
}

export async function criarRecado(titulo, texto) {
    const resposta = await Api.post("/recados", {
        titulo: titulo,
        texto: texto
    });

    return resposta.data;
}

export async function editarRecado(id, titulo, texto) {
    const resposta = await Api.put(`/recados/${id}`, {
        titulo: titulo,
        texto: texto
    });

    return resposta.data;
}

export async function excluirRecado(id) {
    const resposta = await Api.delete(`/recados/${id}`);

    return resposta.data;
}