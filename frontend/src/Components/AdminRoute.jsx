import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { buscarUsuarioLogado } from "../Servicos/AuthService";

function AdminRoute({ children }) {
    const [estado, setEstado] = useState("carregando");

    useEffect(() => {
        buscarUsuarioLogado()
            .then((usuario) => setEstado(usuario.role === "admin" ? "admin" : "comum"))
            .catch(() => setEstado("deslogado"));
    }, []);

    if (estado === "carregando") return <p>Carregando...</p>;
    if (estado === "deslogado") return <Navigate to="/login" />;
    if (estado === "comum") return <Navigate to="/recados" />;

    return children;
}

export default AdminRoute;
