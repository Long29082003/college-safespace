import { useState, useEffect } from "react";

import "../../styles/moreposts-screen-styles/moreposts.css";

export function MorePosts () {
    const [ posts, setPosts ] = useState(null);

    useEffect(() => {
        const loading = async () => {
            try {
                const postsResult = await fetch("/api/dashboard/postinfo");
                const postsData = await postsResult.json();
                setPosts(postsData["posts"]);
            } catch (error) {
                console.log("Cannot connect to the server");
            };
        };

        loading()
    }, []);

    return (
        <div className="more-posts">
            <h1>Posts</h1>
        </div>
    );
};