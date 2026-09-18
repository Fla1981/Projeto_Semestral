import { useEffect, useState } from "react";
import Api from "../Servicos/Api";

function Recados({ onLogout }) {

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [recados, setRecados] = useState([]);

    // Guarda o recado que está sendo editado.
    const [recadoEditando, setRecadoEditando] = useState(null);

    // Lista os recados.
    async function carregarRecados() {

        try {

            // Busca os recados no Back-end.
            const resposta = await Api.get("/recados");

            // Guarda os recados recebidos.
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

    // Executa a função quando a página é carregada.
    useEffect(() => {
        carregarRecados();
    }, []);

    // Adicionar recado.
    async function adicionarRecado(event) {

        // Impede o formulário de recarregar a página.
        event.preventDefault();

        try {

            // Envia o novo recado para o Back-end.
            const resposta = await Api.post("/recados", {
                titulo: titulo,
                texto: texto
            });

            console.log(resposta.data);

            alert("Recado cadastrado com sucesso!");

            // Limpa os campos.
            setTitulo("");
            setTexto("");

            // Atualiza a lista.
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

    // Coloca o recado selecionado no formulário.
    function editarRecado(recado) {

        setRecadoEditando(recado);

        setTitulo(recado.titulo);

        setTexto(recado.texto);
    }

    // Salva a edição do recado.
    async function salvarEdicao(event) {

        event.preventDefault();

        // Verifica se os campos não estão vazios.
        if (!titulo.trim() || !texto.trim()) {

            alert("Título e texto não podem estar vazios.");

            return;
        }

        try {

            // Envia as alterações para o Back-end.
            await Api.put(`/recados/${recadoEditando.id}`, {
                titulo: titulo,
                texto: texto
            });

            alert("Recado editado com sucesso!");

            // Limpa os campos.
            setTitulo("");
            setTexto("");

            // Sai do modo de edição.
            setRecadoEditando(null);

            // Atualiza a lista.
            carregarRecados();

        } catch (erro) {

            console.error(
                "Erro ao editar recado:",
                erro
            );

            if (erro.response) {
                console.log(
                    "Resposta do servidor:",
                    erro.response.data
                );
            }

            alert("Erro ao editar recado.");
        }
    }

    // Excluir recado.
    async function excluirRecado(id) {

        try {

            // Envia a solicitação de exclusão para o Back-end.
            await Api.delete(`/recados/${id}`);

            alert("Recado excluído com sucesso!");

            // Atualiza a lista.
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
        <div className="Recados-Container">

            {/* Cabeçalho da página */}
            <div className="Recados-Header">

                <h1>Meus Recados</h1>

                {/* Botão para sair da conta */}
                <button
                    className="Botao-Sair"
                    onClick={onLogout}
                >
                    Sair
                </button>

            </div>

            <h2>
                {recadoEditando
                    ? "Editar Recado"
                    : "Novo Recado"}
            </h2>

            {/* Formulário de cadastro/edição */}
            <form
                className="Recado-Form"
                onSubmit={
                    recadoEditando
                        ? salvarEdicao
                        : adicionarRecado
                }
            >

                <div>

                    <label>
                        Título:
                    </label>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(event) =>
                            setTitulo(event.target.value)
                        }
                        placeholder="Digite o título"
                    />

                </div>

                <br />

                <div>

                    <label>
                        Texto:
                    </label>

                    <textarea
                        value={texto}
                        onChange={(event) =>
                            setTexto(event.target.value)
                        }
                        placeholder="Digite o texto"
                    />

                </div>

                <br />

                <button type="submit">

                    {recadoEditando
                        ? "Salvar Alterações"
                        : "Adicionar Recado"}

                </button>

                {/* 
                    O botão Cancelar aparece somente
                    quando estamos editando um recado.
                */}
                {recadoEditando && (

                    <button
                        type="button"
                        className="Botao-Cancelar"
                        onClick={() => {

                            setTitulo("");
                            setTexto("");
                            setRecadoEditando(null);

                        }}
                    >
                        Cancelar
                    </button>

                )}

            </form>

            <hr />

            <h2>Lista de Recados</h2>

            {recados.length === 0 ? (

                <p>Nenhum recado cadastrado.</p>

            ) : (

                /*
                    Recados-Lista é o container da lista.

                    Dentro dele usamos map() para percorrer
                    todos os recados recebidos do Back-end.
                */
                <div className="Recados-Lista">

                    {recados.map((recado) => (

                        /*
                            Cada recado vira um cartão.

                            className é usado para aplicar
                            o CSS no cartão.
                        */
                        <div
                            className="Recado-Card"
                            key={recado.id}
                        >

                            <h3>
                                {recado.titulo}
                            </h3>

                            <p>
                                {recado.texto}
                            </p>

                            <button
                                onClick={() =>
                                    editarRecado(recado)
                                }
                            >
                                Editar
                            </button>

                            <br />
                            <br />

                            <button
                                className="Botao-Excluir"
                                onClick={() =>
                                    excluirRecado(recado.id)
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Recados;