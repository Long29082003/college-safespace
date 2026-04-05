import "../styles/loadingscreen.css";
import { Link } from "react-router-dom";
import { Button } from "../utilcomponents/button.jsx";

export function LoadingScreen ({buttonOnClick}) {
    return (
        <div className="loading-screen">
            <Link to = "/admin">To Admin</Link>
            <div className="hover-container">
                <div className="words-container">
                    <p>Comfort</p>
                    <p>Space</p>
                </div>
                <Button callback = {buttonOnClick}>Start exploring</Button>
            </div>
        </div>
    )
}
