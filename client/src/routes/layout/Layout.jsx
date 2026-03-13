import { Outlet } from "react-router-dom";
import "./Layout.css";

import JJCLogo from "../../assets/jjc-logo.png";

export function AuthLayout () {
    return (
        <div className="auth-layout">
            <nav>
                <img className = "logo" src = {JJCLogo} />
            </nav>
            <div className="content">
                <div className="box">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
};