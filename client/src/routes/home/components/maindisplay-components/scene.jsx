import { useEffect, Suspense } from "react";

import { Canvas } from '@react-three/fiber';

import { Objects } from "./objects.jsx";
import { OrbitControls } from "@react-three/drei";
import { Background } from "./background.jsx";
import { LinearToneMapping } from "three";

import "../../styles/maindisplay-components-style/scene.css";

export const Scene = () => {

    return (
        <Canvas 
            className = "canvas"
            id = "main-canvas"
            gl = {{toneMapping: LinearToneMapping, toneMappingExposure: 0.95}}
            camera = {{fov: 45, near: 0.1, far: 1000, position: [0, 0, 20]}}
        >
            <Suspense fallback = {null}>
                <Objects/>
                {/* <OrbitControls
                    enableDamping
                    dampingFactor = {0.01}
                /> */}
                <Background/>
            </Suspense>
        </Canvas>
    )
};