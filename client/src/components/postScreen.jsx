//* Leo has "calm" emotion that does not have in feelingsChip
//Todo For comments section, every time activePostInPostScreen changes, use useEffect to fetch relevant comments ✅
//Todo When user press "Enter" in sharescreen, prevent submitting form. Also find a way to let people write paragraphs in message
//Todo Display something when there is no post (can use derived state)
//Todo Create a comment button, maybe work on the back end of submitting comment too
import { useState, useContext, useRef, useEffect } from "react";
import { States } from "../App.jsx";

import { Button } from "../utilcomponents/button.jsx";
import { Comment } from "../utilcomponents/comment.jsx";

import { feelingsColors } from "../utilcomponents/feelingchips.js";
import "../styles/postscreen.css";

export function PostScreen () {
    //? States
    const states = useContext(States);
    const { activePostInPostScreen, setAppStates } = states;
    const [ comments, setComments ] = useState([]);

    const [ messageAnimationProgress, setMessageAnimationProgress ] = useState(0);
    let { id, name, recipient, feelings, message, created_at } = activePostInPostScreen;

    //? Refs
    const postScreen = useRef(null);
    const messageContainer = useRef(null);

    //? Fetch new comments every time activePostInPostScreen change
    useEffect(() => {
        async function fetchPostComments () {
            const response = await fetch(`/api/get/comment?post_id=${id}`);
            
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            } else {
                console.log("Internal server error")
            }
        };

        if (id) fetchPostComments();
    }, [activePostInPostScreen]);

    //? Rendering comment;
    const displayComments = () => {
        return comments.map(comment => {
            return <Comment commentInfo = {comment}/>
        });
    };

    if (created_at) {
        const timeStamp = new Date(created_at);
        created_at = timeStamp.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    feelings = JSON.parse(feelings);

    const displayFeelings = () => {
        return feelings.map(feeling => {
            const matchedFeeling = feelingsColors.find(feelingObject => feelingObject.feeling === feeling);
            const styles = {
                color: matchedFeeling.textColor,
                backgroundColor: matchedFeeling.bgColor
            };

            return <span className="feeling-chip" style = {styles}>{feeling}</span>
        });
    };

    let bgColor;
    let textColor;
    const firstFeelingColors = feelingsColors.find(feeling => feeling.feeling === feelings[0]);
    if (!firstFeelingColors) {
        bgColor = "rgb(220, 239, 249)";
        textColor = "black";
    } else {
        bgColor = firstFeelingColors.bgColor;
        textColor = firstFeelingColors.textColor;
    };

    const backgroundColorStyle = { backgroundColor: bgColor};
    const textColorStyle = { "--text-color": textColor};


    //? This code is for the animation to fill the color of text in .full-post-message when user scroll down
    const handleOnScroll = (event) => {
        const { scrollTop, clientHeight } = event.currentTarget;
        const messageContainerRect = messageContainer.current.getBoundingClientRect();
        const messageContainerOriginalPosition = Math.round(scrollTop + messageContainerRect.top); //✅
        const clamp = (min, max, number) => Math.max(Math.min(max, number), min);

        const offSetEntry = 0.65 * clientHeight;
        const offSetExit = -0.64 * clientHeight;

        let progress = ( scrollTop + offSetEntry - messageContainerOriginalPosition ) / (messageContainerRect.height + offSetEntry + offSetExit);
        progress = clamp(0, 1, progress);

        // console.log("1: ", offSetExit);
        // console.log("Progess: ", progress * 100);
        setMessageAnimationProgress(progress * 100);
    };

    const handleExit = () => {
        postScreen.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setAppStates(false, true, null);
    };

    return (
        <div className="post-screen" onScroll = {handleOnScroll} ref = {postScreen}>

            <div className="full-post" style = {backgroundColorStyle}>
                <div className="full-post-utils"></div>

                <div className="full-post-header">
                    <div className="main-info-container">
                        <div className="name-recipient-container">
                            <div className="name">From {name}</div>
                            <div className="recipient">to {recipient}</div>
                        </div>
                        <div className="date">{created_at}</div>
                    </div>
                    <div className="feelings">
                        {displayFeelings()}
                    </div>
                </div>

                <div className="full-post-message" style = {{"--animation-progress": `${messageAnimationProgress}%`}} ref = {messageContainer}>
                    <span style = {textColorStyle}>
                        {/* {message} */}
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    </span>
                </div>

                <div className="full-post-comment">
                    <h2>Comments</h2>
                    <div className="comments-container">
                        {displayComments()}
                    </div>
                </div>
            </div>

            <Button id = "page-exit-button" callback = {() => handleExit()}>X</Button>
        </div>
    )
};