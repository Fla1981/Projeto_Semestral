import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Servicos/Api";

function Login() {

    // Guarda o email digitado pelo usuário.
    const [email, setEmail] = useState("");

    // Guarda a senha digitada pelo usuário.
    const [senha, setSenha] = useState("");

    // Permite navegar entre as páginas.
    const navigate = useNavigate();

    async function handleSubmit(event) {

        // Impede o formulário de recarregar a página.
        event.preventDefault();

        try {

            // Envia email e senha para o Back-end.
            const resposta = await Api.post("/login", {
                email: email,
                password: senha
            });

            console.log(resposta.data);

            // Guarda o token recebido do Back-end no navegador.
            // Por enquanto estamos usando localStorage.
            localStorage.setItem("token", resposta.data.token);

            alert("Login realizado com sucesso!");

            // Depois do login, vai para a página de recados.
            navigate("/recados");

        } catch (erro) {

            console.error("Erro ao logar na conta:", erro);

            if (erro.response) {
                console.log(
                    "Resposta do servidor:",
                    erro.response.data
                );
            }

            alert("O seu email ou senha está incorreto.");
        }
    }

    return (
        <div className="Login-Container">

            <div className="Login-Card">

                <h1>Login</h1>

                <form onSubmit={handleSubmit}>

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
                            placeholder="Digite o seu email"
                            required
                        />

                    </div>

                    <br />

                    <div>

                        <label htmlFor="senha">
                            Senha
                        </label>

                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            placeholder="Digite a sua senha"
                            required
                        />

                    </div>

                    <br />

                    <button type="submit">
                        Entrar
                    </button>

                    <br />
                    <br />

                    <Link to="/registro">
                        Não tem conta, cadastre-se
                    </Link>

                </form>

            </div>

        </div>
    );
}

export default Login;