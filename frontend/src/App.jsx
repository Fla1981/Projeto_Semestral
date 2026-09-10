import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./Paginas/Login";
import Registro from "./Paginas/Registro";
import Recados from "./Paginas/Recados";
import Api from "./Servicos/Api";
import "./Index.css";

function App() {

    return (
        <BrowserRouter>
            {/* Permite usar rotas no react */}
            <Rotas />
        </BrowserRouter>
    );
}

function Rotas() {

    const navigate = useNavigate();

    // Função para fazer logout do usuário
    async function handleLogout() {

        try {

            // Envio do pedido de logout para API
            await Api.post("/logout");

            // Remove o token salvo
            localStorage.removeItem("token");

            alert("Logout realizado com sucesso");

            navigate("/login");

        } catch (erro) {

            console.error("Erro ao fazer logout: ", erro);

            localStorage.removeItem("token");

            navigate("/login");
        }
    }

    return (
        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/registro"
                element={<Registro />}
            />

            <Route
                path="/recados"
                element={<Recados onLogout={handleLogout} />}
            />

        </Routes>
    );
}

export default App;

