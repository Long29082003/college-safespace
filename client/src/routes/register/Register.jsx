import { useState } from "react";

import { FaCheckCircle } from "react-icons/fa";
import { BiErrorAlt } from "react-icons/bi";
import { LuInfo } from "react-icons/lu";

import { Button } from "../home/utilcomponents/button.jsx";

import "./Register.css";

export function Register () {
    const [ error, setError ] = useState("");
    const [ registerStatus, setRegisterStatus ] = useState(null);

    return (
        <section className="register">
            <div className="error-message">
                <BiErrorAlt id = "error-icon"/>
                {error}
            </div>
            <form action="">
                <label for = "username">New username:</label>
                <div className="input-container">
                    <input id = "username" type="text" required/>
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>3 to 24 characters</div>
                        <p>Must begin with a letter.</p>
                        <p>Letters, numbers, underscores, hyphens allowed.</p>
                    </div>
                </div>

                <label for = "password">New password:</label>
                <div className="input-container">
                    <input id = "password" type="password" required/>
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>8 to 24 characters.</div>
                        <p>Must include uppercase and lowercase letters, a number and a special character.</p>
                        <p>Allowed special characters: @, #, $, %</p>
                    </div>
                </div>

                <label for = "matching-password">Re-type password:</label>
                <div className="input-container">
                    <input id = "matching-password" type="password" required/>
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>Must match the password above</div>
                    </div>
                </div>

                <label for = "secret">Secret</label>
                <div className="input-container">
                    <input id = "secret" type="passowrd"/>
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>Secret key to create Admin account.</div>
                    </div>
                </div>

                <Button hoverEffect = {false}>Register</Button>
            </form>
        </section>
    );
};