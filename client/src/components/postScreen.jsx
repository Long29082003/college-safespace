//* Leo has "calm" emotion that does not have in feelingsChip
//Todo For comments section, every time activePostInPostScreen changes, use useEffect to fetch relevant comments ✅
//Todo When user press "Enter" in sharescreen, prevent submitting form. Also find a way to let people write paragraphs in message ✅
//Todo Display something when there is no post (can use derived state) ✅
//Todo Add function to automatically adjust the textarea height bases on user's input ✅
//Todo Add the second question in comment form ✅
//Todo Add loading animation when user submit comment and pop up animation of new comment after comment got submitted ✅
//Todo Find a way to open the comment window again after user press on another post. ✅
//Todo Work on the back end of submitting comment too: WIP ✅
//Todo Find a way to make the reactions stick only over a certain scrolling range ✅
//Todo Add some animation when user press the reactions icon ✅
//Todo Creat a get reactions from the back end ✅
//Todo Fetch reactions data for each individual posts ✅
//Todo Update reactionsCount when user press on reactions ✅
//Todo Hover over reactions will display how many reactions each category has ✅
//Todo Change the img into background-img so you can control the size of the layout ✅
//Todo Change the react slider so that it will work on full screen too
import clsx from "clsx";
import { useState, useContext, useRef, useEffect } from "react";
import { States } from "../App.jsx";

import { Button } from "../utilcomponents/button.jsx";
import { Comment } from "../utilcomponents/comment.jsx";
import Confetti from "react-confetti";  


import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { feelingsColors } from "../utilcomponents/feelingchips.js";
import "../styles/postscreen.css";

export function PostScreen () {
    //? States
    const states = useContext(States);
    const { activeScreen, activePostInPostScreen, setAppStates } = states;
    const [ comments, setComments ] = useState([]);
    const [ reactionsCount, setReactionsCount ] = useState(null);
    const [ commentFormState, setCommentFormState ] = useState("question-one");
    const [ userCommentBoxText, setUserCommentBoxText ] = useState("");
    const [ userCommentNameText, setUserCommentNameText ] = useState("");
    const [ commentSubmitLoadingState, setCommentSubmitLoadingState ] = useState(null);
    const [ showReactionsDetail, setShowReactionsDetail ] = useState(false);
    const [ playConfetti, setPlayConfetti ] = useState(false);
    const [ disableReactions, setDisableReactions ] = useState(false);

    const [ messageAnimationProgress, setMessageAnimationProgress ] = useState(0);
    let { id, name, recipient, feelings, message, created_at } = activePostInPostScreen;

    //? Refs
    const postScreen = useRef(null);
    const messageContainer = useRef(null);
    const questionTwo = useRef(null);
    const reactions = useRef(null);
    const commentForm = useRef(null);
    const likeAnimation = useRef(null);
    const loveAnimation = useRef(null);
    const loadingAnimation = useRef(null);
    const submittedAnimation = useRef(null);

    const reactionJustPressed = useRef(null);

    //? Derived state/function
    const numberOfComments = comments.length;
    const decideIfButtonEnabled = () => {
        if (commentFormState === "question-one") {
            return userCommentBoxText.length > 0;
        } else if (commentFormState === "question-two") {
            return userCommentBoxText.length > 0 && userCommentNameText.length > 0;
        };
    };
    const canClickButton = decideIfButtonEnabled();

    //? Fetch new comments every time activePostInPostScreen change
    useEffect(() => {
        async function fetchPostComments () {
            const response = await fetch(`/api/get/comment?post_id=${id}`);
            
            if (response.ok) {
                let data = await response.json();
                data = data.map(comment => {
                    return {
                        ...comment,
                        filler: false
                    };
                });
                setComments(data);
            } else {
                console.log("Internal server error")
            };
        };

        async function fetchPostReactions () {
            const response = await fetch(`/api/get/reaction?post_id=${id}`);
            
            if (response.ok) {
                const data = await response.json();
                const likeReaction = data.find(reaction => reaction.type === "like");
                const loveReaction = data.find(reaction => reaction.type === "love");
                const likeCount = likeReaction && likeReaction["number_of_reactions"] || 0;
                const loveCount = loveReaction && loveReaction["number_of_reactions"] || 0;
                setReactionsCount({
                    like: likeCount,
                    love: loveCount    
                });
            } else {
                console.log("Internal server error");
            };
        };

        if (id) {
            //? Reset comment form before fetching comments
            resetCommentForm();
            //? Run post reactions animation one time before fetching comments
            setTimeout(() => {
                likeAnimation.current.play();
                loveAnimation.current.play();              
            }, 500)

            fetchPostComments()
            fetchPostReactions();
        };
    }, [activePostInPostScreen]);

    //? Rendering comment;
    const displayComments = () => {
        if (numberOfComments === 0) {
            return <div className="no-comment-notice">No comment on this post yet</div>
        };

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

        setMessageAnimationProgress(progress * 100);
    };

    const updateUserCommentText = (event) => {
        setUserCommentBoxText(event.currentTarget.value);
    };

    const updateUserNameText = (event) => {
        setUserCommentNameText(event.currentTarget.value);
    };

    const handleMouseEnterReactionsDetail = () => {
        setShowReactionsDetail(true);
    };

    const handleMouseLeaveReactionsDetail = () => {
        setShowReactionsDetail(false);
    };

    const collapseReactions = () => {
        reactions.current.style.height = "0px";
        reactions.current.style.boxShadow = "unset";
    };

    const resetCommentForm = () => {
        reactions.current.style.height = "166px";
        reactions.current.style.boxShadow = "0px 0px 1px 1px rgb(143, 143, 143)";
        commentForm.current.style.height = "auto";
        commentForm.current.style.paddingTop = "25px";
        commentForm.current.style.paddingBottom = "25px";
        setPlayConfetti(false);
        setCommentFormState("question-one");
        setUserCommentBoxText("");
        setUserCommentNameText("");
        setCommentSubmitLoadingState(null);
        setDisableReactions(false);
    };

    const collapseCommentForm = () => {
        const commentFormSpec = commentForm.current.getBoundingClientRect();

        commentForm.current.style.height = `${commentFormSpec.height}px`;
        commentForm.current.offsetHeight;

        commentForm.current.style.height = "0px";
        commentForm.current.style.paddingTop = "0px";
        commentForm.current.style.paddingBottom = "0px";
    };

    const addFillerComment = (fillerCommentData) => {
        setComments(prev => {
            const copyOfComments = [...prev];
            const date = new Date();
            const fillerComment = {
                                    id: "N/A",
                                    name: fillerCommentData.commentorName,
                                    message: fillerCommentData.commentText,
                                    created_at: date.toJSON(),
                                    filler: true
                                  }
            copyOfComments.unshift(fillerComment);
            return copyOfComments;
        });
    };

    const handleCommentNextButton = () => {
        const commentFormSpec = commentForm.current.getBoundingClientRect();
        const questionTwoSpec = questionTwo.current.getBoundingClientRect();

        commentForm.current.style.height = `${commentFormSpec.height}px`;
        commentForm.current.offsetHeight;

        commentForm.current.style.height = `${commentFormSpec.height + questionTwoSpec.height + 20}px`;
        setCommentFormState("question-two");
    };

    const handleReactionSubmit = (reactionPressed) => {
        reactionJustPressed.current = reactionPressed;
        setDisableReactions(true);
        if (reactionPressed === "like") {
            likeAnimation.current.setFrame(0);
            likeAnimation.current.play();       
        } else if (reactionPressed === "love") {
            loveAnimation.current.setFrame(0);
            loveAnimation.current.play();      
        };

        const loading = async () => {
            try {
                const response = await fetch(`/api/submit/reaction`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        type: reactionPressed,
                        postId: id
                    })
                });

                await new Promise(resolve => setTimeout(resolve, 1500));

                if (response.ok) {
                    setPlayConfetti(true);
                    collapseReactions();
                    setReactionsCount(prev => {
                        if (reactionPressed === "like") {
                            return {
                                ...prev,
                                like: prev.like + 1
                            };
                        } else if (reactionPressed === "love") {
                            return {
                                ...prev,
                                love: prev.love + 1
                            };
                        };
                    });
                } else {
                    console.log("Rollback");
                };
            } catch (error) {
                console.log("Error connecting to the server");
            };
        }

        loading();
    };

    const handleCommentSubmit = () => {
        setCommentSubmitLoadingState("loading");
        loadingAnimation.current.play();

        const loading = async () => {
            const response = await fetch("/api/submit/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "commentText": userCommentBoxText,
                    "commentorName": userCommentNameText,
                    "postId": id
                })
            });

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (response.ok) {
                const data = await response.json();
                submittedAnimation.current.play();
                setCommentSubmitLoadingState("submitted");
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                collapseCommentForm();
                addFillerComment(data);
            } else {
                setCommentSubmitLoadingState("submit-failed");
                console.log("Comment submit unsuccessfully");
            }
        }

        loading();
    };

    const handleCommentButtonClick = () => {
        if (commentFormState === "question-one") {
            return canClickButton ? handleCommentNextButton() : null;
        } else if (commentFormState === "question-two") {
            return canClickButton ? handleCommentSubmit() : null;
        };
    };

    const displayConfetti = () => {
        const reactionsSpec = reactions.current.getBoundingClientRect();
        const { scrollTop, scrollWidth, scrollHeight } = postScreen.current;
        return (
            <Confetti 
                numberOfPieces = {100}
                width = {scrollWidth}
                height = {scrollHeight}
                recycle = {false}
                confettiSource = {{x: reactionsSpec.left + reactionsSpec.width / 2, y: scrollTop + reactionsSpec.top}}
                tweenDuration = {500}
                onConfettiComplete={() => setPlayConfetti(false)}
            />
        );
    };

    const returnReactionsStyle = () => {
        if (reactionJustPressed.current === "like") return {backgroundColor: "rgb(204, 222, 232)"};
        else if (reactionJustPressed.current === "love") return {backgroundColor: "rgb(226, 201, 226)"};
    };

    const likeAnimationContainerStyle = {
        backgroundColor: reactionJustPressed.current === "like" ? "white" : "rgb(238, 238, 244)"
    };

    const loveAnimationContainerStyle = {
        backgroundColor: reactionJustPressed.current === "love" ? "white" : "rgb(238, 237, 240)"
    };

    const handleExit = () => {
        postScreen.current.scrollTo({
            top: 0,
            behavior: "smooth"
        });
        setAppStates(false, true, activeScreen === "post-screen-from-more-posts" ? "more-posts-screen" : null);
    };

    return (
        <div className="post-screen" onScroll = {handleOnScroll} ref = {postScreen}>

            <div className="full-post" style = {backgroundColorStyle}>
                <div className="full-post-utils">
                </div>

                <div className="full-post-header">
                    <div className="main-info-container">
                        <div className="name-recipient-container">
                            <div className="name">From {name}</div>
                            <div className="recipient">to {recipient}</div>
                        </div>
                        <div className="date-reactions-container">
                            <div className="date">{created_at}</div>
                            <div 
                                className="reactions-count" 
                                onMouseEnter = {handleMouseEnterReactionsDetail} 
                                onMouseLeave = {handleMouseLeaveReactionsDetail}
                            >
                                <div className="small-reactions">
                                    <img src="lottie-animation/like-reaction-img.png" alt="image of thumbs up icon" />
                                    <img src="lottie-animation/love-reaction-img.png" alt="image of a heart icon" />
                                </div>
                                <p className="count">{reactionsCount ? Object.values(reactionsCount).reduce((acc, count) => acc + count) : ""}</p>
                                {showReactionsDetail ? <div className="counts-detail">
                                    <div className="type">
                                        <div className="like-icon"></div>
                                        <p>{reactionsCount ? reactionsCount["like"] : 0}</p>
                                    </div>
                                    <div className="type">
                                        <div className="love-icon"></div>
                                        <p>{reactionsCount ? reactionsCount["love"] : 0}</p>
                                    </div>
                                </div> : null}
                            </div>
                        </div>
                    </div>
                    <div className="feelings">
                        {displayFeelings()}
                    </div>
                </div>

                <div 
                    className="full-post-message" 
                    style = {{"--animation-progress": `${messageAnimationProgress}%`}} 
                    ref = {messageContainer}
                >
                    <div className="scrollable-range">
                        <div className="reactions-container" style = {{top: activeScreen === "post-screen-from-more-posts" ? "300px": "100px"}}>
                            <div className="reactions" ref = {reactions} style = {disableReactions ? returnReactionsStyle() : null}> 
                                <div className="like-animation-container" style = {disableReactions ? likeAnimationContainerStyle : null}>
                                    <DotLottieReact
                                        src="lottie-animation/comment-like-animation.lottie"
                                        dotLottieRefCallback={(dotLottie) => {
                                            likeAnimation.current = dotLottie;
                                        }}
                                        onClick={() => disableReactions ? null : handleReactionSubmit("like")}
                                    />
                                </div>
                                <div className="love-animation-container" style = {disableReactions ? loveAnimationContainerStyle : null}>
                                    <DotLottieReact
                                        src="lottie-animation/comment-love-animation.lottie"
                                        dotLottieRefCallback={(dotLottie) => {
                                            loveAnimation.current = dotLottie;
                                        }}
                                        speed={0.35}
                                        onClick = {() => disableReactions ? null : handleReactionSubmit("love")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <span style = {textColorStyle}>
                        {/* {message} */}
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
                    </span>
                </div>

                <div className="full-post-comment">
                    <div className="head">
                        <h2>Comments</h2>
                        <span className="comment-number">{numberOfComments}</span>
                    </div>

                    <form 
                        className={clsx("user-comment-form", `${commentFormState}-active`, commentSubmitLoadingState)} 
                        ref = {commentForm}
                    >
                        <div className="input-container">
                            <div className="question-one">
                                <p>1. Enter your comment</p>
                                <textarea 
                                    name="comment" 
                                    rows = "1" 
                                    value = {userCommentBoxText} 
                                    onInput = {updateUserCommentText}
                                ></textarea>
                            </div>
                            <div className="question-two" ref = {questionTwo}>
                                <p>2. You will be seen as</p>
                                <input 
                                    name = "commentor" 
                                    type="text" 
                                    value = {userCommentNameText}
                                    onInput = {updateUserNameText}
                                />
                            </div>
                        </div>

                        <div 
                            className={clsx("button-container", canClickButton ? "button-enabled" : "button-disabled")} 
                            style = {{"--text-color": canClickButton ? textColor : "rgb(146, 141, 141)"}}
                        >
                            <Button 
                                type = "button" 
                                callback = {handleCommentButtonClick}
                            >{commentFormState === "question-one" ? "Next" : "Submit"}</Button>

                            <div className="animations-container">

                                <div className="loading-animation-container">
                                    <DotLottieReact
                                        src="lottie-animation/comment-loading-animation.lottie"
                                        loop
                                        style = {{width: 160, height: 130}}
                                        dotLottieRefCallback={(dotLottie) => {
                                            loadingAnimation.current = dotLottie;
                                        }}
                                    />
                                </div>

                                <div className="submitted-animation-container">
                                    <DotLottieReact
                                        src="lottie-animation/submit_complete_animation.lottie"
                                        loop = {false}
                                        style={{width: 110, height: 110}}
                                        dotLottieRefCallback={(dotLottie) => {
                                            submittedAnimation.current = dotLottie;
                                        }}
                                    />
                                </div>

                            </div>
                        </div>
                    </form>

                    <div className="comments-container">
                        {displayComments()}
                    </div>
                </div>
            </div>

            {playConfetti ? displayConfetti() : null}

            <Button id = "page-exit-button" callback = {() => handleExit()}>X</Button>
        </div>
    )
};