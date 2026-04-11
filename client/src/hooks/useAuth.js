import { AuthContext } from "../authcomponents/AuthProvider.jsx";
import { useContext } from "react";

export const useAuth = () => {
    const { auth, setAuth, persistLoginLoading, setPersistLoginLoading, persistLogin, setPersistLogin } = useContext(AuthContext);
    return { auth, setAuth, persistLoginLoading, setPersistLoginLoading, persistLogin, setPersistLogin };
};