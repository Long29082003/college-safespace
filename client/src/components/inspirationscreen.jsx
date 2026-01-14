import { DarkBackground } from "../utilcomponents/darkbackground";
import { Button } from "../utilcomponents/button.jsx";
import { tilting } from "../utilFunctions/utils.js";
import MaSaiGonImg from "../assets/masaigon.avif";

import { useRef, useContext } from "react";
import { States } from "../App.jsx";

import "../styles/inspirationscreen.css"; 

export function InspirationScreen () {
    //? States
    const states = useContext(States);

    //? Refs
    const container = useRef(null);
    const tiltingContainer = useRef(null);
    
    const handleTilting = (event) => {
        tilting(event, tiltingContainer, 0.02, 4);
    };

    const handleExit = () => {
        container.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        states.setAppStates(false, true, null);
    };

    return (
        <div className="inspiration-screen"  ref = {container} onMouseMove = {handleTilting}>
            <div className="tilting-container" ref = {tiltingContainer}>
                <div className="creator-note">
                    <h1 className="header">Purpose</h1>
                    <div className="creator-note-text">
                        "One thing I’ve realized since coming to JJC is that every student is a kaleidoscope—reflecting thousands of stories and emotions. 
                        Some stories are waiting to be told, some struggles are quietly bottled up, and some vulnerabilities are deeply hidden. 
                        I hope this space can offer a sense of comfort for sharing any part of your story, and remind you that there are people who are willing to listen."
                    </div>
                </div>
                <div className="page-rules">
                    <h2>Rules</h2>
                    <div className="page-description">
                        This platform allows JJC students to anonymously share personal stories, emotions, and reflections. 
                        It is designed to be a supportive space that values empathy, respect, and the act of being heard.
                    </div>
                    <div className="rules-container">
                        <div className="rule">
                            <div className="rule-head" style = {{"--order-num": '"1"'}}>Write with honesty and respect</div>
                            <div className="rule-text" style = {{"color": "rgb(247, 234, 238)"}}>Share your story in your own words, while being mindful of others. Harassment, hate speech, or targeted attacks are not allowed.</div>
                        </div>
                        <div className="rule">
                            <div className="rule-head" style = {{"--order-num": '"2"'}}>Protect privacy — yours and others’</div>
                            <div className="rule-text" style = {{"color": "rgb(223, 231, 250)"}}>Avoid using real names or identifiable details. This space is meant to be safe and anonymous for everyone.</div>
                        </div>
                        <div className="rule">
                            <div className="rule-head" style = {{"--order-num": '"3"'}}>Share, don’t harm</div>
                            <div className="rule-text" style = {{"color": "rgb(231, 250, 246)"}}>This platform is for expression and reflection, not for promoting violence, self-harm, or harm toward others.</div>
                        </div>
                    </div>
                </div>
                
                <div className="inspiration">
                    <h2>Inspiration</h2>
                    <div className="prevent-overflow-container">
                        <div className="inspiration-image-container"><img src={MaSaiGonImg} alt="Ma Sai Gon poster" /></div>
                    </div>
                    <div className="inspiration-text">
                        Ma Sai Gon is known for its quiet, almost meditative atmosphere—a place where 
                        people are invited to slow down and reflect without pressure. That experience shaped my intention 
                        to bring the same sense of stillness and emotional safety into this project, 
                        creating a space that feels gentle, grounded, and welcoming to honest expression.
                    </div>
                </div>

                <DarkBackground />
            </div>
            <Button id = "page-exit-button" callback = {() => handleExit()}>X</Button>
        </div>
    );
};