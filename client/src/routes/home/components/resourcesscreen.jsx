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
                                    This site is created by a student from <b>Joliet Junior College</b>. 
                                    After the passing of a closed friend, the creator hoped to make a site where 
                                    people would feel comfortable to take a rest and let off a small burden on their journey.
                                </div>
                            </div>

                            <div className="fact">
                                <h3>Partnered with People Who Cared</h3>
                                <div className = "paragraph">
                                    This project is supported by the Center for Student Wellness and Support at Joliet Junior College.
                                    <div className="line-break"></div>
                                    The center provides students with access to mental health support, counseling services, wellness initiatives, 
                                    and resources designed to help students thrive both academically and personally. 
                                    Their mission focuses on creating accessible, compassionate, and inclusive support for student well-being.
                                    <div className="line-break"></div>
                                    Learn more here: <a href="https://jjc.edu/student-resources/mental-health-wellness" target = "_blank" rel = "noopener noreferrer">JJC Mental Health & Wellness</a>
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