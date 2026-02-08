//Todo: Work on joining table at the back end to fetch post and their reactions at the sasme time 
import { useState, useEffect } from "react";

import "../../styles/moreposts-screen-styles/moreposts.css";

import { PostInMorePost } from "./postInMorePost.jsx";

export function MorePosts () {
    const [ posts, setPosts ] = useState(null);

    useEffect(() => {
        const loading = async () => {
            try {
                const postsResult = await fetch("/api/dashboard/postinfo");
                const postsData = await postsResult.json();
                const posts = postsData["posts"];
                
                setPosts(posts);
            } catch (error) {
                console.log("Cannot connect to the server");
            };
        };

        loading()
    }, []);

    const displayPosts = () => {
        return posts.map(post => {
            return (
                <PostInMorePost
                    postInfo = {{...post}}
                />
            )
        });
    };

    return (
        <div className="more-posts">
            <h1>Posts</h1>
            <div className="posts-container">
                {posts ? displayPosts() : null}
            </div>
        </div>
    );
};