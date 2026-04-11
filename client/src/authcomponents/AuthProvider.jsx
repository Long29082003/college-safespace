import { useState, createContext } from "react";
import { Outlet } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = () => {
    const [ auth, setAuth ] = useState({});
    const [ persistLogin, setPersistLogin ] = useState(false);
    const [ persistLoginLoading, setPersistLoginLoading ] = useState(true);
    console.log(persistLogin);

    return (
        <AuthContext.Provider value = {{auth, setAuth, persistLoginLoading, setPersistLoginLoading, persistLogin, setPersistLogin}}>
            <Outlet/>
        </AuthContext.Provider>
    )
};  