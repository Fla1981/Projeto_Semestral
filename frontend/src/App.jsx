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
import Admin from "./Paginas/Admin";
import AdminRoute from "./Components/AdminRoute";
import PrivateRoute from "./Components/PrivateRoute";
import { logout } from "./Servicos/AuthService";
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

    // Logout: o back-end invalida a sessão e o cookie HttpOnly deixa de valer
    async function handleLogout() {
        try {
            await logout();
        } catch (erro) {
            console.error("Erro ao fazer logout: ", erro);
        } finally {
            navigate("/login");
        }
    }

    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route
                path="/recados"
                element={
                    <PrivateRoute>
                        <Recados onLogout={handleLogout} />
                    </PrivateRoute>
                }
            />

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <Admin onLogout={handleLogout} />
                    </AdminRoute>
                }
            />
        </Routes>
    );
}

export default App;
