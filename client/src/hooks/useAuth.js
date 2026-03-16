import { AuthContext } from "../authcomponents/AuthProvider.jsx";
import { useContext } from "react";

export const useAuth = () => {
    const { auth, setAuth } = useContext(AuthContext);
    return { auth, setAuth };
};