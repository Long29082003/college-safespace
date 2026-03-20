import { Link } from "react-router-dom";

import { Dashboard } from "./components/dashboard.jsx";

import { FaUserAlt } from "react-icons/fa";
import { LiaDoorOpenSolid } from "react-icons/lia";

import JJCLogo from "../../assets/jjc-logo.png";

import "./admin.css";

export function AdminPage () {
    return (
        <div className="admin-page">
            {/* //? For UI purpose */}
            <div className="padding-top"></div>

            <nav>
                <div className="container">
                    <img src = {JJCLogo} alt="JJC-logo" />

                    <div className="user-box-container">
                        <div className="user-box">
                            <span>Admin</span>
                            <div className="ui-seperator"></div>
                            <div className="img-container">
                                <FaUserAlt id = "default-user-icon"/>
                            </div>
                        </div>
                    </div>

                    <div className="log-out-container">
                        <Link>Log out</Link>
                        <LiaDoorOpenSolid id = "logout-logo"/>
                    </div>

                    <div className="background"></div>
                </div>
            </nav>
            <Dashboard />
        </div>
    )
};