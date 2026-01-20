import "../styles/comment.css";
import clsx from "clsx";

export function Comment ({commentInfo}) {
    const { id, name, message, created_at, filler } = commentInfo;

    const date = new Date(created_at);
    const formattedDate = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });


    return (
        <div className={clsx("comment", filler ? "filler" : null)}>
            <div className="comment-header">
                <div className="name">{name}</div>
                <div className="date">{formattedDate}</div>
            </div>
            <div className="comment-text">{message}</div>
        </div>
    )
};