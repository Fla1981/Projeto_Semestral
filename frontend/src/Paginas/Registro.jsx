import { useState } from "react";
import { Link } from "react-router-dom";
import { registrar } from "../Servicos/AuthService";

function Registro() {

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    async function handleSubmit(event) {
        event.preventDefault();

        if (senha !== confirmarSenha) {
            alert("As senhas não são iguais.");
            return;
        }

        try {
            // Envia os dados para o AuthService
            const resposta = await registrar(
                nome,
                email,
                senha,
                confirmarSenha
            );

            console.log(resposta);

            alert("Cadastro realizado com sucesso!");

            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

        } catch (erro) {

            console.error("Erro ao cadastrar usuário:", erro);

            if (erro.response) {
                console.log("Resposta do servidor:", erro.response.data);
            }

            alert("Erro ao realizar cadastro.");
        }
    }

    return (
        <div>

            <h1>Cadastro</h1>
            <br />
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="nome">
                        Nome
                    </label>

                    <input
                        id="nome"
                        type="text"
                        value={nome}
                        onChange={(event) =>
                            setNome(event.target.value)
                        }
                        placeholder="Entre com o seu nome"
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
                        }
                        placeholder="Entre com o seu email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="Senha">
                        Senha
                    </label>

                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(event) =>
                            setSenha(event.target.value)
                        }
                        placeholder="Entre com a senha"
                        required
                    />
                </div>

                <br />

                <div>
                    <label htmlFor="confirmarSenha">
                        Confirmar senha
                    </label>

                    <input
                        id="confirmarSenha"
                        type="password"
                        value={confirmarSenha}
                        onChange={(event) =>
                            setConfirmarSenha(event.target.value)
                        }
                        placeholder="Confirme sua senha"
                        required
                    />
                </div>

                <br />

                <Link to="/login">
                    Já possui uma conta? Faça login
                </Link>

                <br />
                <br />

                <button type="submit">
                    Cadastrar
                </button>

            </form>

        </div>
    );
}

export default Registro;
