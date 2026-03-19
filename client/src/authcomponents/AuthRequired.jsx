import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export function AuthRequired ({allowedRole}) {
    console.log(allowedRole);
    const location = useLocation();
    const { auth } = useAuth();

    return (
        <>
            {
                !auth ? <Navigate to = "/login" state = {{from: location}}/>
                      :  auth.roles?.indexOf(allowedRole) !== -1 ? <Outlet />
                                                                 : null
            }
        </>
    );
};