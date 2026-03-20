import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = () => {
    const [ auth, setAuth ] = useState({});

    return (
        <AuthContext.Provider value = {{auth, setAuth}}>
            <Outlet/>
        </AuthContext.Provider>
    )
};