import { useState } from "react";

import { BiErrorAlt } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { Button } from "../home/utilcomponents/button.jsx";

import "./login.css";

export function Login () {
    const [ error, setError ] = useState("");

    return (
        <section className = "log-in">
            {error && 
            <div className="error-message">
                <BiErrorAlt id = "error-icon"/>
                {error}
            </div>}

            <form action="">

                <label htmlFor = "username">Username:</label>
                <div className="input-container">
                    <input id = "username" type="text" />
                    <FaUserAlt id = "username-icon"/>
                </div>

                <label htmlFor = "password">Password:</label>
                <div className="input-container">
                    <input id = "password" type="password" />
                    <FaKey id = "password-icon"/>
                </div>
                
                <div className="checkbox-container">
                    <input id = "persist-checkbox" type="checkbox" />
                    <label htmlFor = "persist-checkbox">Stay logged in</label>
                </div>

                <Button hoverEffect = {false}>Sign in</Button>
            </form>
        </section>
    )
};