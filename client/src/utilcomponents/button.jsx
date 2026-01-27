import "../styles/button.css";
import {useRef} from "react";

export function Button ({children, callback, id = "", type = "button", hoverEffect = true}) {
    const buttonContainer = useRef(null);

    const handleOnMouseMove = (event) => {
        const { clientX, clientY } = event;
        const rect = buttonContainer.current.getBoundingClientRect();
        const buttonMiddleXPosition = rect.left + rect.width/2;
        const buttonMiddleYPosition = rect.top + rect.height/2;
        const dx = clientX - buttonMiddleXPosition;
        const dy = clientY - buttonMiddleYPosition;
        buttonContainer.current.style.transform = `translate(${dx*0.4}px, ${dy*0.4}px)`;
    }

    const handleOnMouseLeave = () => {
        buttonContainer.current.style.transform = "translate(0px, 0px)";
    };

    return (
        <div className="button-hover-area" id = {`${id}-hover-area`} onMouseMove = {hoverEffect ? handleOnMouseMove : null} onMouseLeave = {handleOnMouseLeave}>
            <div className="button-container" ref = {buttonContainer}>
                <button type = {type} id = {id} onClick = {callback}>{children}</button>
            </div>
        </div>

    )
};