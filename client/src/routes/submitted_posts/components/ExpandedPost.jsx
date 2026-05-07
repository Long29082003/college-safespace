import { FaXmark } from "react-icons/fa6";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import "../styles/ExpandedPost.css";

export function ExpandedPost(
    {
        displayedPostInfo, 
        isProceedLoading, 
        setDisplayedPost, 
        setIsRequestFailedMsgOut,
        setDisplaySuccessfulProceed
    }) {
    let { id, name, recipient, feelings, message, created_at } = displayedPostInfo;

    message = message.split("\n");
    const messageWithLineBreak = [];
    message.forEach((string, index) => {
        if (index !== 0) messageWithLineBreak.push(<div className = "line-break" key = {`lb-${index}`}></div>);
        messageWithLineBreak.push(string);
    });

    if (created_at) {
        const timeStamp = new Date(created_at);
        created_at = timeStamp.toLocaleDateString([], {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    feelings = JSON.parse(feelings);

    const displayFeelings = () => {
        return feelings.map(feeling => {
            return <span className="feeling-chip">{feeling}</span>
        });
    };

    const handleExit = () => {
        setDisplayedPost(null);
        setIsRequestFailedMsgOut(false);
        setDisplaySuccessfulProceed({state: false, message: null});
    };

    return (
        <div className = "expanded-post" style = {isProceedLoading ? {display: "grid", placeItems: "center"} : null}>
            {isProceedLoading === false ? 
            <>
                <div className="header">
                    <div className="exit" onClick = {handleExit}><FaXmark id = "exit-icon"/></div>
                    <div className="basic-info">
                        <div className="name">{name}</div>
                        <div className="time">{created_at}</div>
                    </div>
                    <div className="feelings">Feeling {displayFeelings()}</div>
                </div>
                <div className="content">
                    <div className="recipient">To {recipient}</div>
                    {messageWithLineBreak}
                </div>
            </> : <DotLottieReact
                      src="/lottie-animation/Insider-loading.lottie"
                      loop
                      autoplay
                      style = {{height: "300px", width: "300px"}}
                  />}
        </div>
    )    
}