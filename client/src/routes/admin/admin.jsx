import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { ControlPanel } from "./components/controlpanel.jsx"
import { Dashboard } from "./components/dashboard.jsx";
import { lerp } from "./utils.js";

import { FaUserAlt } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { IoIosLogOut } from "react-icons/io";
import { CgViewComfortable } from "react-icons/cg";

import axios from "../../api/axios.js";
import { useAuth } from "../../hooks/useAuth.js";

import "./admin.css";

export function AdminPage () {
    const [ navAnimationProgress, setNavAnimationProgress ] = useState(0);
    const [ userBoxHovered, setUserBoxHovered ] = useState(false);
    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    //? References
    const navContentRef = useRef(null);

    const handleOnScroll = (event) => {
        const navContentRect = navContentRef.current.getBoundingClientRect();
        const animationRange = 120; //In px
        const animationRangeEnd = 30;
        const animationRangeStart = animationRangeEnd + animationRange;
        const { top } = navContentRect;

        const clamp = (progress) => Math.max(Math.min(1, progress), 0);
        let progress = clamp((animationRangeStart - top) / animationRange);
        setNavAnimationProgress(progress);
    };

    const handleLogout = async () => {
        try {
            const response = await axios.get("/api/authorization/logout");
            if (auth) setAuth({});
            navigate("/login", {state: {from: location}}, {replace: true});
        } catch (error) {
            console.log(error);
            console.log("Cannot logout");  
        };
    };

    return (
        <div className="admin-page" onScroll = {handleOnScroll}>
            {/* //? For UI purpose */}
            <div className="padding-top"></div>

            <nav>
                <div className="container" ref = {navContentRef} style = {{"--nav-progress": navAnimationProgress}}>

                    <div className="user-box-container">
                        <div 
                            className="user-box"                            
                            onMouseEnter = {() => setUserBoxHovered(true)}
                            onMouseLeave= {() => setUserBoxHovered(false)}
                        >
                            <span>Admin</span>
                            <div className="ui-seperator"></div>
                            <div className="img-container">
                                <FaUserAlt id = "default-user-icon"/>
                            </div>
                            
                            {userBoxHovered ? <div className="hover-box">
                                <div className="settings-container">
                                    <FaGear id = "settings-icon"/>
                                    <span>Settings</span>                                
                                </div>
                                <div className="log-out-container" onClick = {handleLogout}>
                                    <IoIosLogOut id = "log-out-icon"/>
                                    <span>Log out</span>
                                </div>
                            </div> : null}
                        </div>
                    </div>

                    <Link to = "/">
                        <span>Comfort Space</span>
                        <CgViewComfortable id = "comfort-space-logo"/>
                    </Link>

                    <div className="background"></div>
                </div>
            </nav>
            
            <ControlPanel />

            <Dashboard />
            <div className="placeholder"></div>
        </div>
    )
};