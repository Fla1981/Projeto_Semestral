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

export async function enviarAnexo(id, arquivo) {
    const formData = new FormData();
    formData.append("anexo", arquivo);

    const resposta = await Api.post(`/recados/${id}/anexo`, formData);
    return resposta.data;
}

export async function baixarAnexo(id, nomeArquivo) {
    const resposta = await Api.get(`/recados/${id}/anexo`, {
        responseType: "blob"
    });

    const url = window.URL.createObjectURL(resposta.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = nomeArquivo;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
