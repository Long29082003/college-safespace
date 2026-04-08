import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = () => {
    const [ auth, setAuth ] = useState({});
    const [ persistLoginLoading, setPersistLoginLoading ] = useState(true);

    return (
        <AuthContext.Provider value = {{auth, setAuth, persistLoginLoading, setPersistLoginLoading}}>
            <Outlet/>
        </AuthContext.Provider>
    )
};  