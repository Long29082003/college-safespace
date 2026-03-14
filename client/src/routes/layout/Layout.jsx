import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "./Layout.css";

import JJCLogo from "../../assets/jjc-logo.png";

export function AuthLayout () {
    const [ currentRoute, setCurrentRoute ]  = useState(null);
    const location = useLocation();

    useEffect(() => {
        location?.pathname && (location.pathname === "/register" || location.pathname === "/login") 
            ? setCurrentRoute(location.pathname.slice(1, )) 
            : null  
    }, [location]);

    return (
        <div className="auth-layout">
            <nav>
                <img className = "logo" src = {JJCLogo} />
                <Link to = "/">Back to Comfort Space</Link>
            </nav>
            <div className="content">
                <div className="box">
                    <div className="links">
                        <Link to = "/login" className = {currentRoute === "login" ? "active" : null}>Log In</Link>
                        <Link to = "/register" className = {currentRoute === "register" ? "active" : null}>Register</Link>
                    </div>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
};