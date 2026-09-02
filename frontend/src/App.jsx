import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./Paginas/Login";
import Registro from "./Paginas/Registro";
import Recados from "./Paginas/Recados";
import "./Index.css";
function App() {
    return (
        <BrowserRouter>
            {/* Permite usar rotas no react */}
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
                    element={<Recados />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;