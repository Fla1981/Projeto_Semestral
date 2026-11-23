import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuarioLogado } from "../Servicos/AuthService";
import {
    listarUsuarios,
    criarUsuario,
    editarUsuario,
    excluirUsuario
} from "../Servicos/AdminService";

const FORM_VAZIO = { name: "", email: "", password: "", role: "user" };

// Junta as mensagens de validação do Laravel (422) em um texto só
function mensagemDeErro(erro) {
    const erros = erro.response?.data?.errors;
    if (erros) return Object.values(erros).flat().join(" ");
    return erro.response?.data?.message ?? "Erro inesperado.";
}

function AdminUsuarios({ onLogout }) {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState(FORM_VAZIO);
    const [editando, setEditando] = useState(null);
    const [meuId, setMeuId] = useState(null);

    async function carregar() {
        try {
            setUsuarios(await listarUsuarios());
        } catch (erro) {
            console.error("Erro ao carregar usuários:", erro);
            alert(mensagemDeErro(erro));
        }
    }

    useEffect(() => {
        carregar();
        buscarUsuarioLogado()
            .then((usuario) => setMeuId(usuario.id))
            .catch(() => {});
    }, []);

    function alterarCampo(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function iniciarEdicao(usuario) {
        setEditando(usuario);
        setForm({
            name: usuario.name,
            email: usuario.email,
            password: "",
            role: usuario.role
        });
    }

    function cancelar() {
        setEditando(null);
        setForm(FORM_VAZIO);
    }

    async function salvar(event) {
        event.preventDefault();

        try {
            if (editando) {
                await editarUsuario(editando.id, form);
                alert("Usuário atualizado com sucesso!");
            } else {
                await criarUsuario(form);
                alert("Usuário cadastrado com sucesso!");
            }

            cancelar();
            carregar();
        } catch (erro) {
            console.error("Erro ao salvar usuário:", erro);
            alert(mensagemDeErro(erro));
        }
    }

    async function excluir(usuario) {
        if (!window.confirm(`Excluir ${usuario.name} e todos os recados dele?`)) return;

        try {
            await excluirUsuario(usuario.id);
            carregar();
        } catch (erro) {
            console.error("Erro ao excluir usuário:", erro);
            alert(mensagemDeErro(erro));
        }
    }

    return (
        <div className="Admin-Container">
            <header className="Admin-Header">
                <h1>Gerenciar Usuários</h1>

                <div className="Header-Botoes">
                    <button className="Botao-Secundario" onClick={() => navigate("/admin")}>
                        Voltar
                    </button>
                    <button className="Botao-Sair" onClick={onLogout}>
                        Sair
                    </button>
                </div>
            </header>

            <section className="Recado-Form">
                <h2>{editando ? "Editar Usuário" : "Novo Usuário"}</h2>

                <form onSubmit={salvar}>
                    <div className="Campo">
                        <label htmlFor="name">Nome</label>
                        <input id="name" name="name" type="text" value={form.name} onChange={alterarCampo} />
                    </div>

                    <div className="Campo">
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" type="email" value={form.email} onChange={alterarCampo} />
                    </div>

                    <div className="Campo">
                        <label htmlFor="password">
                            {editando ? "Nova senha (deixe em branco para manter)" : "Senha"}
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={alterarCampo}
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="Campo">
                        <label htmlFor="role">Papel</label>
                        <select
                            id="role"
                            name="role"
                            value={form.role}
                            onChange={alterarCampo}
                            disabled={editando?.id === meuId}
                        >
                            <option value="user">Usuário comum</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div className="Form-Acoes">
                        <button type="submit">
                            {editando ? "Salvar Alterações" : "Cadastrar Usuário"}
                        </button>

                        {editando && (
                            <button type="button" className="Botao-Secundario" onClick={cancelar}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <h2>Usuários Cadastrados</h2>

            <div className="Admin-Grade">
                {usuarios.map((usuario) => (
                    <article className="Admin-Card" key={usuario.id}>
                        <h3>{usuario.name}</h3>
                        <p className="Admin-Texto">{usuario.email}</p>
                        <small className="Papel-Selo">
                            {usuario.role === "admin" ? "Administrador" : "Usuário comum"}
                        </small>

                        <div className="Recado-Acoes">
                            <button onClick={() => iniciarEdicao(usuario)}>Editar</button>

                            {usuario.id !== meuId && (
                                <button className="Botao-Excluir" onClick={() => excluir(usuario)}>
                                    Excluir
                                </button>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default AdminUsuarios;