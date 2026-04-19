import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./styles/PersistAuthLoading.css";

export function PersistAuthLoading () {
    return (
        <div className="auth-loading-page">
            <p>Authenticating</p>
            <DotLottieReact
                src="lottie-animation/Insider-loading.lottie"
                loop
                autoplay
                style= {{width: 200, height: 100}}
            />         
        </div>
    )
};