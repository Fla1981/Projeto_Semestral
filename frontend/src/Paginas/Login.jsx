import { useState } from "react";//guardar informaçoes digitas no formulario
import { Link, useNavigate } from "react-router-dom";
import Api from "../Servicos/Api";

function Login() {
    //guardar os dados digitados
    const [email, setEmail] = useState("");//atualização dos dados
    const [senha, setSenha] = useState("");
    //navegar rotas
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const resposta = await Api.post("/login", {
               email: email,
               password: senha
            });
            console.log(resposta.data);
            //Salva o token de autenticação recebido do Laravel no navegador.
            // Ele será utilizado pelo Axios nas próximas requisições à API.
            localStorage.setItem("token", resposta.data.token);
            alert("Login realizado com sucesso!");
            navigate("/recados");

        } catch (erro) {

            console.error("Erro ao logar na conta",erro);

            if (erro.response) {
                console.log("Resposta do servidor:",erro.response.data);
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

