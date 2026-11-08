import Api from "./Api";

export async function listarTodosRecados() {
    const resposta = await Api.get("/admin/recados");
    return resposta.data;
}
