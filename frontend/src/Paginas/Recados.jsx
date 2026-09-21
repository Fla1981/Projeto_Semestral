import { useEffect, useState } from "react";
import {
    listarRecados,
    criarRecado,
    editarRecado as editarRecadoApi,
    excluirRecado
} from "../Servicos/RecadosService";

function Recados({ onLogout }) {

    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [recados, setRecados] = useState([]);

    // Guardar o recado que está sendo editado
    // Quando o usuário clica em "Editar", o recado correspondente é armazenado aqui para que possamos preencher os campos do formulário com seus dados.
    const [recadoEditando, setRecadoEditando] = useState(null);

    // Listar recados
    async function carregarRecados() {
        try {
            const dados = await listarRecados();

            setRecados(dados);

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

    // Função para editar recado
    function editarRecado(recado) {

        // Preenche os campos do formulário com os dados do recado que está sendo editado
        setRecadoEditando(recado);
        setTitulo(recado.titulo);
        setTexto(recado.texto);
    }

    // Adicionar recados
    async function adicionarRecado(event) {
    event.preventDefault();

        try {
            await criarRecado(titulo, texto);

            alert("Recado cadastrado com sucesso!");

            setTitulo("");
            setTexto("");

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

    // Salvar edição do recado
    async function salvarEdicao(event) {
        event.preventDefault();

        if (!titulo.trim() || !texto.trim()) {
            alert("Título e texto não podem estar vazios.");
            return;
        }

        try {
            await editarRecadoApi(
                recadoEditando.id,
                titulo,
                texto
            );

            alert("Recado editado com sucesso!");

            setTitulo("");
            setTexto("");
            setRecadoEditando(null);

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

    // Excluir recado
   async function excluirRecadoTela(id) {
        try {
            await excluirRecado(id);

            alert("Recado excluído com sucesso!");

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

            <h1>Meus Recados</h1>

            <button onClick={onLogout}>
                Sair
            </button>
            <br />
            <hr />
            <br />

            <h2>
                {recadoEditando ? "Editar Recado" : "Novo Recado"}
            </h2>

            <form onSubmit={recadoEditando ? salvarEdicao : adicionarRecado}>

                <div>
                    <br />
                    <label>Título:</label>

                    <input
                        type="text"
                        value={titulo}
                        onChange={(event) => setTitulo(event.target.value)}
                        placeholder="Digite o título"
                    />
                </div>

                <br />

                <div>
                    <label>Texto:</label>

                    <textarea
                        value={texto}
                        onChange={(event) => setTexto(event.target.value)}
                        placeholder="Digite o texto"
                    />
                </div>

                <br />

                <button type="submit">
                    {recadoEditando
                        ? "Salvar Alterações"
                        : "Adicionar Recado"}
                </button>

                {recadoEditando && (
                    <button
                        type="button"
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

                recados.map((recado) => (

                    <div key={recado.id}>

                        <h3>{recado.titulo}</h3>

                        <p>{recado.texto}</p>

                        <button onClick={() => editarRecado(recado)}>
                            Editar
                        </button>
                        <br />
                        <br />
                        <button className="Botao-Excluir" onClick={() => excluirRecadoTela(recado.id)}>
                            Excluir
                        </button>
                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default Recados;
