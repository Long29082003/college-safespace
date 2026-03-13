import "../styles/loadingscreen.css";
import { Button } from "../utilcomponents/button.jsx";

export function LoadingScreen ({buttonOnClick}) {
    return (
        <div className="loading-screen">
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
