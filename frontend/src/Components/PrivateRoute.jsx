import {Navigate} from "react-router-dom";

function PrivateRoute({children}) {
    //Token Gerado pelo storage
    const token = localStorage.getItem("token");

    if (!token) {
        //Navegação para o login
        return <Navigate to="/login" />;
    }
    return children;
}

export default PrivateRoute;