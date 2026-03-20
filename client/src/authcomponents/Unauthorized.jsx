import { Link } from "react-router-dom";
import { FaRobot } from "react-icons/fa6";

import "./styles/Unauthorized.css";

export function UnauthorizedPage () {
    return (
        <div className="unauthorized-page">
            <div className="text">
                <h1>You do not have access to this page.</h1>
                <div className="icon-container"><FaRobot id = "robot-icon"/></div>
            </div>
            <div className="link-container"><Link to = "/admin">To Home page</Link></div>
        </div>
    )
};