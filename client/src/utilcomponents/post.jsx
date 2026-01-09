// Todo Change the UI so that people can see part of the message right away, only backs ground appears on hover ✅
// Todo Randomize the postion of post so it has a little bit variety ✅
// Todo Switch the Post animation from using CSS to web animation API so that you can stop when tab out
import { TbHandClick } from "react-icons/tb";
import { feelingsColors } from "../utilcomponents/feelingchips.js";

export function Post ({postInfo}) {
    let {id, name, recipient, feelings, message, created_at} = postInfo;
    const timeStamp = new Date(created_at);
    const formattedDate = timeStamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    
    feelings = JSON.parse(feelings);

    let bgColor;
    let textColor;
    const firstFeelingColors = feelingsColors.find(feeling => feeling.feeling === feelings[0]);
    if (!firstFeelingColors) {
        bgColor = "rgb(220, 239, 249)";
        textColor: "black";
    } else {
        bgColor = firstFeelingColors.bgColor;
        textColor = firstFeelingColors.textColor;
    };

    const backgroundColorStyle = { backgroundColor: bgColor};
    const textColorStyle = { "--text-color": textColor};
    const spawnPosition = {
        "--top-position": `${Math.round(Math.random() * 150) - 70}px`,
        "--left-position": `${Math.round(Math.random() * 125) - 75}px`
    };

    return (
        <div className="post" style = {spawnPosition}>
            <div className="post-head">
                <h2 className="name">{name}</h2>
                <p className="date">{formattedDate}</p>
            </div>

            <div className="recipient">Sent to {recipient.toLowerCase()}</div>

            <p className="feeling" style = {textColorStyle}>
                {feelings.map(feeling => <span>{feeling}</span>)}
            </p>
            
            <div className="expandable-view">
                <div className="message" style = {textColorStyle}>{message.length >= 100 ? `${message.slice(0,50)} ...` : message}</div>
                <div className="expandable-view-background"></div>
            </div>

            <div className="click-icon-container"><TbHandClick/></div>

            <div className="background" style = {backgroundColorStyle}></div>
        </div>
    )
}