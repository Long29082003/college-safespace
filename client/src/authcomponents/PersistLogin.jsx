import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useRefreshToken } from "../hooks/useRefreshToken.js";

export function PersistLogin () {
    const { auth, setPersistLoginLoading } = useAuth();
    const refresh = useRefreshToken();
    
    useEffect(() => {
        const fastAuth = async () => {
            const response = await refresh();
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            setPersistLoginLoading(false);
        };

        if (!auth?.roles) fastAuth();
        else setPersistLoginLoading(false);     
    }, []);

    return (
        <Outlet/>
    )
};