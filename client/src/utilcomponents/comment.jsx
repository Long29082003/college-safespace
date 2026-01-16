import "../styles/comment.css";

export function Comment ({commentInfo}) {
    const { id, name, message, created_at } = commentInfo;

    const date = new Date(created_at);
    const formattedDate = date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });


    return (
        <div className="comment">
            <div className="comment-header">
                <div className="name">{name}</div>
                <div className="date">{formattedDate}</div>
            </div>
            <div className="comment-text">{message}</div>
        </div>
    )
};