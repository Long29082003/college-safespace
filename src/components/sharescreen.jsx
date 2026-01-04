//Todo: Add animation to the steps-display ✅
//Todo: Change the active class to the outer class so that the icons can also get access to it ✅
//Todo: Figure out a smooth exist transition ✅
//Todo: Finish the submit and work on the backend
import clsx from "clsx";
import { Button } from "../utilcomponents/button.jsx";
import { useState, useContext } from "react";
import { States } from "../App.jsx";

import { MdOutlinePermIdentity } from "react-icons/md";
import { CgMailForward } from "react-icons/cg";
import { MdOutlineMessage } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

import "../styles/sharescreen.css";

export function ShareScreen () {
    //? States
    const [formQuestionState, setFormQuestionState] = useState("question-one-active");
    const states = useContext(States);
    
    const handleQuestionOneNextButtonClick = () => {
        setFormQuestionState("question-two-active");
    };

    const handleQuestionTwoPreviousButtonClick = () => {
        setFormQuestionState("question-one-active");
    };

    const handleQuestionTwoNextButtonClick = () => {
        setFormQuestionState("question-three-active");
    };

    const handleQuestionThreePreviousButtonClick = () => {
        setFormQuestionState("question-two-active");
    };

    const handleQuestionThreeNextButtonClick = () => {
        setFormQuestionState("question-submit-active");
    };

    const handleQuestionSubmitPreviousButtonClick = () => {
        setFormQuestionState("question-three-active");
    };

    return (
        <div className={clsx("share-screen", formQuestionState)}>

            <div className="steps-display">
                <div className="question-one-icon"><MdOutlinePermIdentity /></div>
                <div className="line"></div>
                <div className="question-two-icon"><CgMailForward /></div>
                <div className="line"></div>
                <div className="question-three-icon"><MdOutlineMessage /></div>
                <div className="line"></div>
                <div className="question-submit-icon"><CiCircleCheck /></div>
            </div>

            <form action="">
                <div className="question-one">
                    <h1>You will be remembered as</h1>
                    <p>"Anonymous" if left blank</p>
                    <input type="text" name = "name" placeholder = "Anonymous"/>
                    <div className="questions-button-container">
                        <div className="placeholder"></div>
                        <Button type = "button" callback = {handleQuestionOneNextButtonClick}>Next</Button>
                    </div>
                </div>

                <div className="question-two">
                    <h1>To whom or what you want to address?</h1>
                    <input type="text" name = "to" />
                    <div className="questions-button-container">
                        <Button type = "button" callback = {handleQuestionTwoPreviousButtonClick}>Previous</Button>
                        <Button type = "button" callback = {handleQuestionTwoNextButtonClick}>Next</Button>
                    </div>
                </div>

                <div className="question-three">
                    <h1>Write your message</h1>
                    <textarea name = "message"/>
                    <div className="questions-button-container">
                        <Button type = "button" callback = {handleQuestionThreePreviousButtonClick}>Previous</Button>
                        <Button type = "button" callback = {handleQuestionThreeNextButtonClick}>Next</Button>
                    </div>
                </div>

                <div className="question-submit">
                    <h1>Thank you for your submission</h1>
                    <div className="questions-button-container">
                        <Button type = "button" callback = {handleQuestionSubmitPreviousButtonClick}>Previous</Button>
                        <Button type = "button">Submit</Button>
                    </div>
                </div>
            </form>

            <Button id = "form-exit-button" callback = {() => {states.setStates(true, null)}}>X</Button> 

            <div className="background"></div>
        </div>
    )
};