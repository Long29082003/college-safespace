//Todo: Add animation to the steps-display ✅
//Todo: Change the active class to the outer class so that the icons can also get access to it ✅
//Todo: Figure out a smooth exist transition ✅
//Todo: Adding more emotion. Press the button then present the emotion in 4 columns ✅
//Todo: Adding loading and submit complete animation ✅
//Todo: Finish the submit and work on the backend
import clsx from "clsx";
import { Button } from "../utilcomponents/button.jsx";
import { useState, useContext, useRef } from "react";
import { States } from "../App.jsx";

import { MdOutlinePermIdentity } from "react-icons/md";
import { CgMailForward } from "react-icons/cg";
import { TbMoodEdit } from "react-icons/tb";
import { IoMdJournal } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { feelings, expandedFeelings } from "../utilcomponents/feelingchips.js";
import "../styles/sharescreen.css";

import { tilting } from "../utilFunctions/utils.js";

export function ShareScreen () {
    //? States
    const [formQuestionState, setFormQuestionState] = useState("question-one-active");
    const [activeFeelings, setActiveFeelings] = useState([]);
    const [showHiddenFeelingsContainer, setShowHiddenFeelingsContainer] = useState(false);
    const [formSubmitLoading, setFormSubmitLoading] = useState(null);
    const states = useContext(States);

    //? Ref
    const tiltingContainer = useRef(null);
    const loadingAnimation = useRef(null);
    const submittedAnimation = useRef(null);

    //? UI rendering

    const handleFeelingChipClick = (feelingName) => {
        setActiveFeelings(prev => {
            if (prev.includes(feelingName)) {
                const copy = prev.filter(feeling => feeling !== feelingName);
                return copy;
            } else {
                const copy = [...activeFeelings];
                copy.push(feelingName);
                return copy;
            };
        });
    };

    const displayFeelingsList = () => {
        return feelings.map((feeling, index) => {
            const styles = {
                backgroundColor: activeFeelings.includes(feeling.feeling) ? feeling.bgColor : "",
                color: activeFeelings.includes(feeling.feeling) ? feeling.textColor : "",
                transform: `scale(${activeFeelings.includes(feeling.feeling) ? 1.1 : 1})` 
            };

            return <div 
                        style = {styles}
                        key = {`feelings-${index}`} 
                        className = "feeling-chip"
                        onClick = {() => handleFeelingChipClick(feeling.feeling)}
                    >{feeling.feeling}</div>;
        })
    };

    const displayExpandedFeelingsList = () => {
        const displayColumn = (column) => {
            return expandedFeelings[column].map((feeling, index) => {
                const styles = {
                    backgroundColor: activeFeelings.includes(feeling.feeling) ? feeling.bgColor : "",
                    color: activeFeelings.includes(feeling.feeling) ? feeling.textColor : "",
                    transform: `scale(${activeFeelings.includes(feeling.feeling) ? 1.1 : 1})` 
                };

                return <div 
                            style = {styles}
                            key = {`${column}-feelings-${index}`} 
                            className = "feeling-chip"
                            onClick = {() => handleFeelingChipClick(feeling.feeling)}
                        >{feeling.feeling}</div>;
            })
        };

        return (
            <>
                <div className="positive feelings-column">
                    <span className = "column-head">Positive</span>
                    {displayColumn("positive")}
                </div>
                <div className="heavy feelings-column">
                    <span className = "column-head">Heavy</span>
                    {displayColumn("heavy")}
                </div>
                <div className="tense feelings-column">
                    <span className = "column-head">Tense</span>
                    {displayColumn("tense")}
                </div>
                <div className="college feelings-column">
                    <span className = "column-head">College</span>
                    {displayColumn("college")}
                </div>
            </>
        )
    };

    const handleTilting = (event) => {
        tilting(event, tiltingContainer, 0.05, 5);
    };

    //? Handle the clicking of "next", "previous", "expand feelings", "submit" buttons 
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
        setFormQuestionState("question-four-active");
    };

    const handleQuestionFourPreviousButtonClick = () => {
        setFormQuestionState("question-three-active");
    };

    const handleQuestionFourNextButtonClick = () => {
        setFormQuestionState("question-submit-active");
    };

    const handleQuestionSubmitPreviousButtonClick = () => {
        setFormQuestionState("question-four-active");
    };

    const handleFeelingExpandButton = () => {
        setShowHiddenFeelingsContainer(true);
    };

    const handleFormPostSubmit = (formData) => {
        const name = formData.get("name");
        const recipient = formData.get("to");
        const feelings = [...activeFeelings];
        const message = formData.get("message");
        setFormSubmitLoading("submit-loading");
        loadingAnimation.current.play();

        const loading = async () => {
            try {
                const result = await fetch("/api/submit/post", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name, recipient, feelings, message})
                });

                //? Delay complete for 2s
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (result) {
                    setFormSubmitLoading("form-submitted");
                    submittedAnimation.current.play();
                    setTimeout(() => handleExit(), 3000);
                } else if (!result) {
                    console.log("Cannot submit your form");
                };
                
            } catch (error) {
                //! Placeholder for now
                console.log("Internal server error")
            };
        }
        
        loading();
    };

    const handleExit = () => {
        states.setAppStates(true, null);
        setTimeout(() => {
            console.log("1s passed");
            setFormQuestionState("question-one-active");
            setActiveFeelings([]);
            setShowHiddenFeelingsContainer(false);
            setFormSubmitLoading(null);
        }, 1000)
    }

    return (
        <div 
            className={clsx(
                "share-screen", 
                formQuestionState, 
                formSubmitLoading === "submit-loading" && "submit-loading",
                formSubmitLoading === "form-submitted" && "form-submitted"
            )} 
            onMouseMove = {handleTilting}
        >

            <div className="steps-display">
                <div className="question-one-icon"><MdOutlinePermIdentity /></div>
                <div className="line"></div>
                <div className="question-two-icon"><CgMailForward /></div>
                <div className="line"></div>
                <div className="question-three-icon"><TbMoodEdit /></div>
                <div className="line"></div>
                <div className="question-four-icon"><IoMdJournal /></div>
                <div className="line"></div>
                <div className="question-submit-icon"><FaCheckCircle /></div>
            </div>

            <div className="tilting-container" ref = {tiltingContainer}>
                <form action={handleFormPostSubmit}>
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
                        <input type="text" name = "to" placeholder = "The multiverse"/>
                        <div className="questions-button-container">
                            <Button type = "button" callback = {handleQuestionTwoPreviousButtonClick}>Previous</Button>
                            <Button type = "button" callback = {handleQuestionTwoNextButtonClick}>Next</Button>
                        </div>
                    </div>

                    <div className = {clsx("question-three", showHiddenFeelingsContainer ? "show-hidden" : "")}>
                        <h1>Right now, I am feeling</h1>
                        <div className="feelings-container">
                            {displayFeelingsList()}
                        </div>
                        <button 
                            type = "button" 
                            id = "feeling-expand-button" 
                            onClick = {handleFeelingExpandButton}
                        >See more emotions</button>

                        <div className="hidden-feelings-container">
                            {displayExpandedFeelingsList()}
                        </div>

                        <div className="questions-button-container">
                            <Button type = "button" callback = {handleQuestionThreePreviousButtonClick}>Previous</Button>
                            <Button type = "button" callback = {handleQuestionThreeNextButtonClick}>Next</Button>
                        </div>
                    </div>

                    <div className="question-four">
                        <h1>Write your message</h1>
                        <textarea name = "message"/>
                        <div className="questions-button-container">
                            <Button type = "button" callback = {handleQuestionFourPreviousButtonClick}>Previous</Button>
                            <Button type = "button" callback = {handleQuestionFourNextButtonClick}>Next</Button>
                        </div>
                    </div>

                    <div className="question-submit">
                        <h1>Whoever you are, your voice is heard</h1>
                        <div className="status-animations-container">
                            <div className="submitted-animation-container">
                                <DotLottieReact
                                    src="lottie-animation/submit_complete_animation.lottie"
                                    loop = {false}
                                    style={{width: 170, height: 170}}
                                    dotLottieRefCallback={(dotLottie) => {
                                        submittedAnimation.current = dotLottie;
                                    }}
                                />
                            </div>    
                            <div className="loading-animation-container">
                                <DotLottieReact
                                    src="lottie-animation/loading_animation.lottie"
                                    loop
                                    // autoplay
                                    style={{width: 170, height: 170}}
                                    dotLottieRefCallback={(dotLottie) => {
                                        loadingAnimation.current = dotLottie
                                    }}
                                />
                            </div>                   
                        </div>
                        <Button type = "submit" id = "share-form-submit-button">Submit</Button>
                        <div className="questions-button-container">
                            <Button type = "button" callback = {handleQuestionSubmitPreviousButtonClick}>Previous</Button>
                            <div className="placeholder"></div>
                        </div>
                    </div>
                </form>
            </div>

            <Button id = "form-exit-button" callback = {handleExit}>X</Button> 

            <div className="background"></div>
        </div>
    )
};