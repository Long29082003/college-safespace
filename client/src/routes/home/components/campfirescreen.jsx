//Todo Figure out a way to set the degree that would not overlap each other too much for the appearing post
//Todo Learn three.js (freeCodeCamp or MasteryJS)  
import { States } from "../Home.jsx";
import { useState, useContext, useEffect } from "react";
import axios from "../../../api/axios.js";

import clsx from "clsx";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { DarkBackground } from "../utilcomponents/darkbackground";
import { Button } from "../utilcomponents/button.jsx";

import { FaRegPaperPlane } from "react-icons/fa";

import "../styles/campfirescreen.css";

export function CampFireScreen() {
    const states = useContext(States);
    //? Local state
    const [ campfireMessage, setCampfireMessage ] = useState([]);
    const [ scrollingMessage, setScrollingMessage ] = useState([]);
    const [ inputText, setInputText ] = useState("");

    const [ submissionStatus, setSubmissionStatus ] = useState(null);
    const [ submissionNotification, setSubmissionNotification ] = useState("");

    const [ errorMessage, setErrorMessage ] = useState(null);

    //? Derived state
    const allowSubmit = inputText?.length > 0;

    //? UseEffect
    useEffect(async () => {
        try {
            const response = await axios.get("/api/get/campfiremsg");
            const data = response.data;
            setCampfireMessage(data["campfire-message"]);
        } catch (error) {
            console.log(error);
            setErrorMessage("Initial data load failed");
        };
    }, []);

    const handleSubmitCampfireMessage = () => {
        if (!allowSubmit) return;

        const postMessage = async () => {
            try {
                const response = await axios.post("/api/submit/campfiremsg", { message: inputText });
                setInputText("");
                setSubmissionStatus("success");
            } catch (error) {
                setSubmissionStatus("error");
                if (!error.response) setSubmissionNotification("Error: Connection error");
                else if (error.response?.status === 400) setSubmissionNotification("Error 400: Bad request");
                else if (error.response?.status === 500) setSubmissionNotification("Error 500: Unknown error"); 
                else setSubmissionNotification("Error: Unknown");
            };
        };

        setSubmissionStatus("loading");
        postMessage();
    };

    return (
        <div className="campfire-screen">
            <div className="camp-fire">
                <div className="pulsing-background"></div>
                <DotLottieReact
                    src="lottie-animation/campfire-animation.lottie"
                    loop
                    autoplay
                    style = {{width: "210px", height: "210px", scale: 1.02, cursor: "pointer"}}
                />

                <div className="campfire-messages">

                </div>
            </div>

            <div className="message-display">
                <div className="display">
                    <div className="rotate-anchor">
                        <div className="scrolling-message">Hello im Long Doan. I am a student at JJC</div>
                    </div>
                </div>
                <input
                    className = {clsx(inputText ? "has-text" : null)} 
                    type="text" 
                    placeholder = "type here"
                    value = {inputText}
                    onChange = {(event) => setInputText(event.currentTarget.value)}
                />
                <Button id = "msg-submit-button" className = {clsx(!allowSubmit ? "closed" : null)} callback = {handleSubmitCampfireMessage}><FaRegPaperPlane id = "msg-submit-icon"/></Button>
            </div>
            <Button id = "exit-button" callback = {() => states.setAppStates(false, true, null, true)}>X</Button>
            <DarkBackground />

            {/* //? Props below */}
            <div className="moon-container">
                <div className="moon">
                    <div className="crater-1"></div>
                    <div className="crater-2"></div>
                    <div className="crater-3"></div>

                    <div className="halo-1"></div>
                    <div className="halo-2"></div>
                </div>
            </div>
        </div>  
    );
};