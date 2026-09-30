import { useState } from "react";//guardar informaçoes digitas no formulario
import { Link, useNavigate } from "react-router-dom";
import { login } from "../Servicos/AuthService";

function Login() {
    //guardar os dados digitados
    const [email, setEmail] = useState("");//atualização dos dados
    const [senha, setSenha] = useState("");
    //navegar rotas
    const navigate = useNavigate();

    async function handleSubmit(event) {

        event.preventDefault();

        try {
            await login(email, senha);
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
 
                    <div className="Campo">
                        <label htmlFor="email">Email</label>
 
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Digite o seu email"
                            required
                        />
                    </div>
 
                    <div className="Campo">
                        <label htmlFor="senha">Senha</label>
 
                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(event) => setSenha(event.target.value)}
                            placeholder="Digite a sua senha"
                            required
                        />
                    </div>
 
                    <button type="submit" className="Botao-Cheio">
                        Entrar
                    </button>
 
                    <Link to="/registro" className="Form-Link">
                        Não tem conta? Cadastre-se
                    </Link>
 
                </form>
 
            </div>
 
        </div>
    );
}

export default Login;

