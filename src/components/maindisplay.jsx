// Todo: Work on the titling of the .main-display. ✅
// Todo: Ask chatgpt about how to delete Post after aniamtion. ✅
// Todo: Create a submit button ✅
// Todo: Work on creating a form sequence
// Todo: Create a simple backend to store the form data
// Todo: Display the rolling data
import "../styles/maindisplay.css";
import { IoIosMore } from "react-icons/io";
import { GrContact } from "react-icons/gr";
import { FaInfo } from "react-icons/fa6";
import { FaPenToSquare } from "react-icons/fa6";

import { Button } from "../utilcomponents/button.jsx";
import { Post } from "../utilcomponents/post.jsx";
import { useRef, useContext } from "react";
import { States } from "../App.jsx";

export function MainDisplay() {
    //? States passed from App level
    const states = useContext(States);
    const isScrolling = states.isScrolling;
    console.log(states);

    //? Ref
    const tiltingContainer = useRef(null);

    const handleOnMouseMove = (event) => {
        if (!isScrolling) return;
        const {clientX, clientY} = event;
        const rect = event.currentTarget.getBoundingClientRect();
        const middleScreenX = rect.left + rect.width/2;
        const middleScreenY = rect.top + rect.height/2;
        const dx = (clientX - middleScreenX);
        const dy = (clientY - middleScreenY);
        const translateXPixel = -dx * 0.07;
        const translateYPixel = -dy * 0.07;
        const tiltYDegree = dx/middleScreenX * 10;
        const tiltXDegree = -dy/middleScreenY * 10;    

        tiltingContainer.current.style.transform = `rotateX(${tiltXDegree}deg) 
                                                    rotateY(${tiltYDegree}deg)
                                                    translateX(${translateXPixel}px)
                                                    translateY(${translateYPixel}px)`;
    };

    return (
        <div className="main-display" onMouseMove = {handleOnMouseMove} >
            <div className="tilting-container" ref = {tiltingContainer}>
                <div className="scrolling-container">
                    <Post />
                </div>
            </div>

            <Button id = "more-button"><IoIosMore id = "more-icon"/></Button>
            <Button id = "contact-button"><GrContact id = "contact-icon"/></Button>
            <Button id = "info-button"><FaInfo id = "info-icon"/></Button>
            <Button id = "share-button" callback = {states.buttonClicked}><FaPenToSquare />Share your feelings</Button>
        </div>
    )
}