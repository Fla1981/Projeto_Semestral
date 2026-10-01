import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { buscarUsuarioLogado } from "../Servicos/AuthService";

function PrivateRoute({ children }) {
    // null = ainda verificando, true = logado, false = não logado
    const [logado, setLogado] = useState(null);

    useEffect(() => {
        // Pergunta ao back-end se existe sessão (cookie HttpOnly)
        buscarUsuarioLogado()
            .then(() => setLogado(true))
            .catch(() => setLogado(false));
    }, []);

    // Enquanto o back-end não responde, não redireciona
    if (logado === null) {
        return <p>Carregando...</p>;
    }

    if (!logado) {
        //Navegação para o login
        return <Navigate to="/login" />;
    }

    return children;
}

export default PrivateRoute;
