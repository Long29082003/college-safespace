import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function AuthRequired ({allowedRole}) {
    const location = useLocation();
    const { auth } = useAuth();
    console.log(auth?.roles?.indexOf(allowedRole) !== -1);

    return (
        <>
            {
                auth.roles?.includes(allowedRole) ? <Outlet />
                                                  : auth.username ? null
                                                  : <Navigate to = "/login" state = {{from: location}}/> 
            }
        </>
    );
};