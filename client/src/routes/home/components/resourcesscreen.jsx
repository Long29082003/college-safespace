//Todo: When user press space, just add line-break when they submit post
import { useState, useRef, useEffect, useContext } from "react";
import { States } from "../Home.jsx";

import { DarkBackground } from "../utilcomponents/darkbackground.jsx";
import { Button } from "../utilcomponents/button.jsx";

import clsx from "clsx";

import "../styles/resourcesscreen.css";

export function ResourcesScreen () {
    const states = useContext(States);
    const [ displayDropDownState, setDisplayDropDownState ] = useState({
        "did-you-know": false,
    });

    //? References to dropbox elements
    const dropDownBoxReferences = {
        "did-you-know": useRef(null),
    }

    const handleExit = () => {
        states.setAppStates(false, true, null);
        setDisplayDropDownState(
            {
                "did-you-know": false,
            }
        );
    };

    const adjustDropDownHeight = (boxToDisplay) => {
        //? If first fetch then end the function early
        if (dropDownBoxReferences["did-you-know"].current === null || !boxToDisplay) return;

        return {
            height: displayDropDownState[boxToDisplay] ? dropDownBoxReferences[boxToDisplay].current.scrollHeight + 40 + "px" : "0px",
            padding: displayDropDownState[boxToDisplay] ? "20px 20px" : "0px 20px"
        };
    };

    const adjustArrowStyle = (arrowToRotate) => {
        return {
            transform: `rotate(${displayDropDownState[arrowToRotate] ? 180 : 0}deg)`
        };
    };

    const handleDropDownClick = (dropDownName) => {
        setDisplayDropDownState(prev => {
            const copy = JSON.parse(JSON.stringify(prev));
            copy[dropDownName] = !prev[dropDownName];
            return copy;
        });
    };

    return (
        <div className="resources-screen">
            <div className="exit-area" onClick = {handleExit}></div>
            <div className="resources-panel">
                <h1>Resources</h1>
                <div className="dropdowns-container">
                    <div className="dropdown">
                        <h2 className="head" onClick = {() => handleDropDownClick("did-you-know")}>
                            <span className = "text">+ Did you know?</span>
                            <span className = "arrow" style = {adjustArrowStyle("did-you-know")}>▲</span>
                        </h2>
                        <div className="content" ref = {dropDownBoxReferences["did-you-know"]} style={adjustDropDownHeight("did-you-know")}>
                            <div className="fact">
                                <h3>Who created this site?</h3>
                                <div className = "paragraph">
                                    This site is created from a passionate student from <b>Joliet Junior College</b> as 
                                    a project for his creative outlet. Although an
                                    attractive and handsome young man he is, he feels quite lonely sometimes.
                                    To that end, he wants to use his skill to create an environment where students 
                                    like him at JJC do not have to feel lonely anymore.   
                                </div>
                            </div>

                            <div className="fact">
                                <h3>Who sponsored this site?</h3>
                                <div className = "paragraph">
                                    Did you know that this site is proudly sponsored by the Center for Multicultural Access & Success (CMAS) at Joliet Junior College? 
                                    CMAS is dedicated to helping students from all backgrounds thrive in college and beyond. 
                                    They provide one-on-one advising, workshops, leadership development, cultural programs, and access to resources like tutoring and scholarship guidance.
                                    <div className="line-break"></div>
                                    CMAS especially supports underrepresented students — such as first-generation, minority, undocumented, 
                                    English language learners, and international students — empowering them to succeed academically and personally.
                                    <div className="line-break"></div>
                                    By sponsoring this page, CMAS helps ensure that more students can access information, support, and opportunities 
                                    to flourish throughout their educational journey.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Button id = "exit-button" callback = {handleExit}>X</Button>
            </div>

            <DarkBackground/>
        </div>
    )
};