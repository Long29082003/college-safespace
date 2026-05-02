import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../api/axios.js";

import { useAuth } from "../../hooks/useAuth.js";

import { BiErrorAlt } from "react-icons/bi";
import { FaUserAlt } from "react-icons/fa";
import { FaKey } from "react-icons/fa";
import { Button } from "../home/utilcomponents/button.jsx";

import "./login.css";

export function Login () {
    const navigate = useNavigate();
    const location = useLocation();
    const { setAuth, persistLogin, setPersistLogin } = useAuth();
    const [ error, setError ] = useState("");
    const [ password, setPassword ] = useState("");

    const handleLogin = (formData) => {
        const Login = async () => {
            const username = formData.get("username");
            const password = formData.get("password");

            try {
                const response = await axios.post("/api/auth/login", { username, password, persistLogin }
                    , {
                        headers: { "Content-Type" : "application/json"},
                        withCredentials: true
                    }                    
                );
                const data = response.data;
                setAuth(data);
                navigate("/admin", {state: {from: location}}, {replace: true});

            } catch (error) {
                setPassword("");
                if (!error?.response) {
                    setError("No response from server");
                } else if (error.response?.status === 400) {
                    setError("Incorrect format");
                } else if (error.response?.status === 401) {
                    setError("Incorrect username or password");
                } else if (error.response?.status === 500) {
                    setError("Issue connecting to server");
                } else {
                    setError("Error ocurred");
                };
            };
        };  

        Login();
    };

    return (
        <section className = "log-in">
            {error && 
            <div className="error-message">
                <BiErrorAlt id = "error-icon"/>
                {error}
            </div>}

            <form action= {handleLogin}>

                <label htmlFor = "username">Username:</label>
                <div className="input-container">
                    <input id = "username" name = "username" type="text" />
                    <FaUserAlt id = "username-icon"/>
                </div>

                <label htmlFor = "password">Password:</label>
                <div className="input-container">
                    <input 
                        id = "password" 
                        name = "password" 
                        type="password"
                        value = {password}
                        onChange = {(event) => {setPassword(event.currentTarget.value)}} 
                    />
                    {password ? null : <FaKey id = "password-icon"/>}
                </div>
                
                <div className="checkbox-container">
                    <input 
                        id = "persist-checkbox" 
                        type="checkbox" 
                        defaultChecked = {persistLogin}
                        onClick = {(event) => {setPersistLogin(event.currentTarget.checked)}}
                    />
                    <label htmlFor = "persist-checkbox">Stay logged in</label>
                </div>

                <Button type = "submit" hoverEffect = {false}>Sign in</Button>
            </form>
        </section>
    )
};