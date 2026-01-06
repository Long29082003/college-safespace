import { useEffect, useRef } from "react";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";
import "../styles/background.css";

export function Background() {
    const vantaRef = useRef(null);

    useEffect(() => {
        const vantaEffect = FOG({
            el: vantaRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0xffffff,
            midtoneColor: 0xfcebfc,
            lowlightColor: 0xd3b3ef,
            baseColor: 0xe4e4f2,
            blurFactor: 0.47,
            speed: 2.00
        });

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        } 
    }, [])

    return (
        <div className="background" ref = {vantaRef}></div>
    )
};