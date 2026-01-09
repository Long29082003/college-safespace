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
    const textColorStyle = { color: textColor};

    return (
        <div className="post">
            <div className="post-head">
                <h2 className="name">{name}</h2>
                <p className="date">{formattedDate}</p>
            </div>
            <div className="recipient">Sent to {recipient.toLowerCase()}</div>
            <p className="feeling" style = {textColorStyle}>
                {feelings.map(feeling => <span>{feeling}</span>)}
            </p>
            
            <div className="expandable-view" style = {textColorStyle}>
                {message.length >= 100 ? `${message.slice(0,50)} ...` : message}
            </div>

            <div className="click-icon-container"><TbHandClick/></div>

            <div className="background" style = {backgroundColorStyle}></div>
        </div>
    )
}