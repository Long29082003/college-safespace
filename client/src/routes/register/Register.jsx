//Todo: Create a link tag that connect to register and login page on the home route ✅
//Todo: Create a axios instance in another file and import it here
import { useState, useEffect, useRef } from "react";


import { IoIosWarning } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuInfo } from "react-icons/lu";

import { Button } from "../home/utilcomponents/button.jsx";

import "./Register.css";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export function Register () {
    //? States
    const [ error, setError ] = useState("");
    const [ registerStatus, setRegisterStatus ] = useState(null);

    const [ username, setUsername ] = useState("");
    const isUsernameValid = USER_REGEX.test(username);

    const [ password, setPassword ] = useState("");
    const isPasswordValid = PWD_REGEX.test(password);

    const [ isMatchingPwdOnFocus, setIsMatchingPwdOnFocus] = useState(false);

    const [ isSecretOnFocus, setIsSecretOnFocus ] = useState(false);

    //? JSX refs
    const usernameInput = useRef(null);
    const section = useRef(null);

    useEffect(() => {
        usernameInput.current.focus();
    }, []);

    
    const handleRegisterSubmit = (formData) => {
        const matchingPwd = formData.get("matching-password");
        const secret = formData.get("secret");
        if (!USER_REGEX.test(username)) {
            setError("Incorrect username");
            section.current.scrollIntoView();
            return;
        } else if (!PWD_REGEX.test(password)) {
            setError("Incorrect password");
            section.current.scrollIntoView();
            return;
        } else if (password !== matchingPwd) {
            setError("Re-typed password does not match");
            section.current.scrollIntoView();
            return;
        }; 


    };

    return (
        <section className="register" ref = {section}>
            {error && 
            <div className="error-message">
                <IoIosWarning id = "warning-icon"/>
                {error}
            </div>}
            <form action={handleRegisterSubmit}>
                <label htmlFor = "username">
                    <p>New username:<span className="r-asterick">*</span></p>
                    {!username ? null 
                        : isUsernameValid 
                            ? <FaCheckCircle className = "right"/>
                            : <FaCircleXmark className = "wrong"/> }
                </label>
                <div className="input-container">
                    <input 
                        id = "username" 
                        type="text" 
                        ref = {usernameInput} 
                        required
                        value = {username}
                        onChange = {(event) => setUsername(event.target.value)}
                    />
                    {username && !isUsernameValid ?
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>3 to 24 characters</div>
                        <p>Must begin with a letter.</p>
                        <p>No space.</p>
                        <p>Letters, numbers, underscores, hyphens allowed.</p>
                    </div> : null }

                </div>
                <label htmlFor = "password">
                    <p>New password:<span className="r-asterick">*</span></p>
                    {!password ? null 
                        : isPasswordValid
                            ? <FaCheckCircle className = "right"/>
                            : <FaCircleXmark className = "wrong"/> }
                </label>
                <div className="input-container">
                    <input 
                        id = "password" 
                        type="password" 
                        required
                        value = {password}
                        onChange = {(event) => setPassword(event.target.value)}
                    />
                    {password && !isPasswordValid ?
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>8 to 24 characters.</div>
                        <p>Must include uppercase and lowercase letters, a number and a special character.</p>
                        <p>Allowed special characters: @, #, $, %</p>
                    </div> : null }

                </div>

                <label htmlFor = "matching-password">
                    <p>Re-type password:<span className="r-asterick">*</span></p>
                </label>
                <div className="input-container">
                    <input 
                        id = "matching-password" 
                        type="password" 
                        name = "matching-password"
                        required
                        onFocus = {() => setIsMatchingPwdOnFocus(true)}
                        onBlur = {() => setIsMatchingPwdOnFocus(false)}
                    />
                    {isMatchingPwdOnFocus &&                     
                    <div className="requirements">
                            <div className="first-line"><LuInfo className = "requirement-icon"/>Must match the password above</div>
                    </div> }

                </div>

                <label htmlFor = "secret">Secret</label>
                <div className="input-container">
                    <input 
                        id = "secret" 
                        type="passowrd"
                        name="secret"
                        onFocus = {() => setIsSecretOnFocus(true)}
                        onBlur = {() => setIsSecretOnFocus(false)}
                    />
                    {isSecretOnFocus && 
                    <div className="requirements">
                        <div className="first-line"><LuInfo className = "requirement-icon"/>Secret key to create Admin account.</div>
                    </div> }

                </div>

                <Button type = "submit" hoverEffect = {false}>Register</Button>
            </form>
        </section>
    );
};