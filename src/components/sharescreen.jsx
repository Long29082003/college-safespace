//Todo: Add animation to the steps-display
//Todo: Change the active class to the outer class so that the icons can also get access to it
//Todo: Finish the submit and work on the backend

import { Button } from "../utilcomponents/button.jsx";
import { useState } from "react";

import { MdOutlinePermIdentity } from "react-icons/md";
import { CgMailForward } from "react-icons/cg";
import { MdOutlineMessage } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

import "../styles/sharescreen.css";

export function ShareScreen () {
    const [formQuestionState, setFormQuestionState] = useState("question-one-active");
    
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
        <div className="share-screen">

            <div className="steps-display">
                <div className="question-one-icon"><MdOutlinePermIdentity /></div>
                <div className="line"></div>
                <div className="question-two-icon"><CgMailForward /></div>
                <div className="line"></div>
                <div className="question-three-icon"><MdOutlineMessage /></div>
                <div className="line"></div>
                <div className="question-submit-icon"><CiCircleCheck /></div>
            </div>

            <form action="" className = {formQuestionState}>
                <div className="question-one">
                    <h1>How should we call you?</h1>
                    <p>You will be "Anonymous" if left blank</p>
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

            <div className="background"></div>
        </div>
    )
};