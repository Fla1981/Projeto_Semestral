
import { useEffect, useState } from "react";
import Api from "../Servicos/Api";

function Recados({ onLogout }) {

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [recados, setRecados] = useState([]);

    // Listar recados
    async function carregarRecados() {
        try {

            const resposta = await Api.get("/recados");

            setRecados(resposta.data);

        } catch (erro) {

            console.error(
                "Erro ao carregar recados:",
                erro
            );

            if (erro.response) {
                console.log(
                    "Resposta do servidor:",
                    erro.response.data
                );
            }
        }
    }
    //carregar recados na tela aberta
    useEffect(() => {

        carregarRecados();

    }, []);

    // Função para adicionar recado
    async function adicionarRecado(event) {

        event.preventDefault();

        try {

            const resposta = await Api.post("/recados", {
                titulo: titulo,
                texto: texto
            });

            console.log(resposta.data);

            alert("Recado cadastrado com sucesso!");

            setTitulo("");
            setTexto("");

            // Atualiza a lista depois do cadastro
            carregarRecados();

        } catch (erro) {

            console.error(
                "Erro ao cadastrar recado:",
                erro
            );

            if (erro.response) {
                console.log(
                    "Resposta do servidor:",
                    erro.response.data
                );
            }

            alert("Erro ao cadastrar recado.");
        }
    }
    //Funcao para editar recado
    async function editarRecado(id, novoTitulo, novoTexto) {
        const recadoExistente = recados.find((recado) => recado.id === id);
        if (!recadoExistente) {
            alert("Recado não encontrado.");
            return;
        }
        if(!novoTitulo || !novoTexto) {
            alert("Título e texto não podem estar vazios.");
            return;
        }
        try {
            const resposta = await Api.put(`/recados/${id}`, {
                titulo: novoTitulo,
                texto: novoTexto
            });
            alert("Recado editado com sucesso!");
            // Atualiza a lista depois da edição
            carregarRecados();
        } catch (erro) {

            console.error(
                "Erro ao editar recado:",
                erro
            );
            alert("Erro ao editar recado.");
        }
    }

    // Função para excluir recado
    async function excluirRecado(id) {

        try {

            await Api.delete(`/recados/${id}`);

            alert("Recado excluído com sucesso!");

            // Atualiza a lista depois da exclusão
            carregarRecados();

        } catch (erro) {

            console.error(
                "Erro ao excluir recado:",
                erro
            );

            if (erro.response) {
                console.log(
                    "Resposta do servidor:",
                    erro.response.data
                );
            }

            alert("Erro ao excluir recado.");
        }
    }

    return (
        <div>

            <h1>Lista de Recados</h1>

            <button onClick={onLogout}>
                Sair
            </button>
            <br />
            <br />
            <form onSubmit={adicionarRecado}>

                <div>
                    <label htmlFor="titulo">
                        Título
                    </label>

                    <input
                        id="titulo"
                        type="text"
                        value={titulo}
                        onChange={(event) =>
                            setTitulo(event.target.value)
                        }
                        placeholder="Digite o título aqui"
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="texto">
                        Texto
                    </label>

                    <input
                        id="texto"
                        type="text"
                        value={texto}
                        onChange={(event) =>
                            setTexto(event.target.value)
                        }
                        placeholder="Digite o seu texto aqui"
                        required
                    />
                </div>

                <br />

                <button type="submit">
                    Adicionar Recado
                </button>
                <br />
            </form>

            <hr />

            <h2>Meus Recados</h2>

            {recados.length === 0 ? (
                <p>
                    Nenhum recado cadastrado.
                </p>
            ) : (
                recados.map((recado) => (
                    <article key={recado.id}>

                        <h3>
                            {recado.titulo}
                        </h3>

                        <p>
                            {recado.texto}
                        </p>

                        <button
                            onClick={() =>
                                excluirRecado(recado.id)
                            }
                        >
                            Excluir
                        </button>
                        <button 
                            onClick={() => editarRecado(recado.id)}
                        >
                            Editar
                        </button>

                    </article>
                ))
            )}

        </div>
    );
}

export default Recados;

