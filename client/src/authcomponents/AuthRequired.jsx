import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { PersistAuthLoading } from "./PersistAuthLoading.jsx";

export function AuthRequired ({allowedRole}) {
    const location = useLocation();
    const { auth, persistLoginLoading } = useAuth();

    return (
        <>
            {
                persistLoginLoading ? <PersistAuthLoading />
                : auth.roles?.includes(allowedRole) ? <Outlet />
                                                  : auth.username ? null
                                                  : <Navigate to = "/login" state = {{from: location}}/> 
            }
        </>
    );
};