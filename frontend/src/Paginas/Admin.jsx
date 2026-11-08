import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTodosRecados } from "../Servicos/AdminService";
import { baixarAnexo } from "../Servicos/RecadosService";

function Admin({ onLogout }) {
    const navigate = useNavigate();
    const [recados, setRecados] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        async function carregar() {
            try {
                setRecados(await listarTodosRecados());
            } catch (e) {
                console.error("Erro ao carregar recados:", e);
                setErro("Não foi possível carregar os recados.");
            } finally {
                setCarregando(false);
            }
        }
        carregar();
    }, []);

    return (
        <div className="Admin-Container">
            <header className="Admin-Header">
                <h1>Painel de Administrador</h1>

                <div className="Admin-Botoes">
                    <button className="Botao-Secundario" onClick={() => navigate("/recados")}>
                        Voltar
                    </button>
                    <button className="Botao-Sair" onClick={onLogout}>
                        Sair
                    </button>
                </div>
            </header>

            <h2>Recados Registrados</h2>

            {carregando && <p>Carregando...</p>}
            {erro && <p className="Vazio">{erro}</p>}
            {!carregando && !erro && recados.length === 0 && (
                <p className="Vazio">Nenhum recado registrado.</p>
            )}

            <div className="Admin-Grade">
                {recados.map((recado) => (
                    <article className="Admin-Card" key={recado.id}>
                        <h3>{recado.titulo}</h3>
                        <p className="Admin-Texto">{recado.texto}</p>
                        <small className="Admin-Autor">
                            <strong>Por:</strong> <span>{recado.user?.name}</span>
                        </small>

                        {recado.anexo_nome && (
                            <button
                                className="Admin-Arquivo"
                                onClick={() => baixarAnexo(recado.id, recado.anexo_nome)}
                            >
                                {recado.anexo_nome}
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Admin;
