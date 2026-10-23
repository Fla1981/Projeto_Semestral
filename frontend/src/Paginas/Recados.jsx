import { useEffect, useState } from "react";
import PokemonService from "../Servicos/PokemonService";
import {
       listarRecados,
       criarRecado,
       editarRecado as editarRecadoApi,
       excluirRecado,
       enviarAnexo,
       baixarAnexo
} from "../Servicos/RecadosService";

function Recados({ onLogout }) {
    const [pokemon, setPokemon] = useState(null);
    const [nomePokemon, setNomePokemon] = useState("");
    const [carregandoPokemon, setCarregandoPokemon] = useState(false);
    const [titulo, setTitulo] = useState("");
    const [texto, setTexto] = useState("");
    const [recados, setRecados] = useState([]);
    const [anexo, setAnexo] = useState(null);
    const [campoArquivo, setCampoArquivo] = useState(0);

    // Guardar o recado que está sendo editado
    // Quando o usuário clica em "Editar", o recado correspondente é armazenado aqui para que possamos preencher os campos do formulário com seus dados.
    const [recadoEditando, setRecadoEditando] = useState(null);
    
     //api pokemon 
     async function buscarPokemon() {
    if (!nomePokemon.trim()) {
        alert("Digite o nome de um Pokémon.");
        return;
    }

    try {
        setCarregandoPokemon(true);

        const dados = await PokemonService.buscarPokemon(nomePokemon);

        setPokemon(dados);

    } catch (erro) {
        console.error("Erro ao buscar Pokémon:", erro);
        alert("Pokémon não encontrado.");
        setPokemon(null);

    } finally {
        setCarregandoPokemon(false);
    }
}

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

    // Limpa o arquivo escolhido e o campo de arquivo do formulário
    function limparAnexo() {
        setAnexo(null);
        setCampoArquivo((n) => n + 1);
    }

    useEffect(() => {
        carregarRecados();
    }, []);

    // Função para editar recado
    function editarRecado(recado) {

        // Preenche os campos do formulário com os dados do recado que está sendo editado
        setRecadoEditando(recado);
        setTitulo(recado.titulo);
        setTexto(recado.texto);
    }

    // Cancelar a edição e limpar o formulário
    function cancelarEdicao() {
        setRecadoEditando(null);
        setTitulo("");
        setTexto("");
        limparAnexo();
    }

    // Adicionar recados
    async function adicionarRecado(event) {
        event.preventDefault();

        try {
            // Cria o recado uma única vez e guarda o resultado
            const novo = await criarRecado(titulo, texto);

            setTitulo("");
            setTexto("");

            // Anexo opcional: só envia se o usuário escolheu um arquivo
            if (anexo) {
                try {
                    await enviarAnexo(novo.id, anexo);
                } catch (erroAnexo) {
                    const msg =
                        erroAnexo.response?.data?.errors?.anexo?.[0] ??
                        "Não foi possível enviar o anexo.";
                    alert("Recado salvo, mas o anexo falhou: " + msg);
                    console.error("Falha no anexo:", erroAnexo);
                    limparAnexo();
                    carregarRecados();
                    return;
                }
            }

            alert("Recado cadastrado com sucesso!");
            limparAnexo();
            carregarRecados();

        } catch (erro) {
            console.error("Erro ao cadastrar recado:", erro);

            if (erro.response) {
                console.log("Resposta do servidor:", erro.response.data);
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
            await editarRecadoApi(recadoEditando.id, titulo, texto);

            // Anexo opcional: se escolheu um arquivo, troca o anexo do recado
            if (anexo) {
                try {
                    await enviarAnexo(recadoEditando.id, anexo);
                } catch (erroAnexo) {
                    const msg =
                        erroAnexo.response?.data?.errors?.anexo?.[0] ??
                        "Não foi possível enviar o anexo.";
                    alert("Recado editado, mas o anexo falhou: " + msg);
                    console.error("Falha no anexo:", erroAnexo);
                }
            } else {
                alert("Recado editado com sucesso!");
            }

            setTitulo("");
            setTexto("");
            setRecadoEditando(null);
            limparAnexo();
            carregarRecados();

        } catch (erro) {
            console.error("Erro ao editar recado:", erro);

            if (erro.response) {
                console.log("Resposta do servidor:", erro.response.data);
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
        <div className="Recados-Container">
 
            <header className="Recados-Header">
                <h1>Meus Recados</h1>
 
                <button className="Botao-Sair" onClick={onLogout}>
                    Sair
                </button>
            </header>
 
            {/* Formulário de novo recado / edição */}
            <section className="Recado-Form">
 
                <h2>
                    {recadoEditando ? "Editar Recado" : "Novo Recado"}
                </h2>
 
                <form onSubmit={recadoEditando ? salvarEdicao : adicionarRecado}>
 
                    <div className="Campo">
                        <label htmlFor="titulo">Título</label>
 
                        <input
                            id="titulo"
                            type="text"
                            value={titulo}
                            onChange={(event) => setTitulo(event.target.value)}
                            placeholder="Digite o título"
                        />

                        <label htmlFor="anexo">Anexo (opcional: imagem ou PDF, até 5 MB)</label>
                        <input
                            key={campoArquivo}
                            id="anexo"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf"
                            onChange={(event) => setAnexo(event.target.files[0] ?? null)}
                        />
                    </div>
 
                    <div className="Campo">
                        <label htmlFor="texto">Texto</label>
 
                        <textarea
                            id="texto"
                            value={texto}
                            onChange={(event) => setTexto(event.target.value)}
                            placeholder="Digite o texto"
                        />
                    </div>
 
                    <div className="Form-Acoes">
                        <button type="submit">
                            {recadoEditando
                                ? "Salvar Alterações"
                                : "Adicionar Recado"}
                        </button>
 
                        {recadoEditando && (
                            <button
                                type="button"
                                className="Botao-Secundario"
                                onClick={cancelarEdicao}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
 
                </form>
 
            </section>
 
            {/* Busca de Pokémon (API externa) */}
            <section className="Pokemon-Secao">
 
                <h2>Buscar Pokémon</h2>
 
                <div className="Pokemon-Busca">
                    <input
                        type="text"
                        value={nomePokemon}
                        onChange={(event) => setNomePokemon(event.target.value)}
                        placeholder="Ex: pikachu"
                    />
 
                    <button onClick={buscarPokemon}>
                        Buscar
                    </button>
                </div>
 
                {carregandoPokemon && (
                    <p className="Pokemon-Status">Buscando Pokémon...</p>
                )}
 
                {pokemon && (
                    <div className="Pokemon-Card">
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                        />
 
                        <div>
                            <h3>{pokemon.name.toUpperCase()}</h3>
 
                            <p>
                                <strong>Tipo:</strong>{" "}
                                {pokemon.types
                                    .map((tipo) => tipo.type.name)
                                    .join(", ")}
                            </p>
 
                            <p>
                                <strong>Altura:</strong> {pokemon.height / 10} m
                            </p>
 
                            <p>
                                <strong>Peso:</strong> {pokemon.weight / 10} kg
                            </p>
                        </div>
                    </div>
                )}
 
            </section>
 
            {/* Lista de recados */}
            <h2>Lista de Recados</h2>
 
            {recados.length === 0 ? (
 
                <p className="Vazio">Nenhum recado cadastrado.</p>
 
            ) : (
 
                <div className="Recados-Lista">
                    {recados.map((recado) => (
 
                        <div className="Recado-Card" key={recado.id}>
 
                            <h3>{recado.titulo}</h3>
 
                            <p>{recado.texto}</p>
 
                            <div className="Recado-Acoes">
                                <button onClick={() => editarRecado(recado)}>
                                    Editar
                                </button>
 
                                <button
                                    className="Botao-Excluir"
                                    onClick={() => excluirRecadoTela(recado.id)}
                                >
                                    Excluir
                                </button>
                                   {recado.anexo_nome && (
                                    <button onClick={() => baixarAnexo(recado.id, recado.anexo_nome)}>
                                        {recado.anexo_nome}
                                    </button>
                                )}
                            </div>
 
                        </div>
                    ))}
                </div>
            )}
 
        </div>
    );
}

export default Recados;
