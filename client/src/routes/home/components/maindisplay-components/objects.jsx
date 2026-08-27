//TODO How to unattach the animation to a timeline from ScrollTrigger after timeline.isStillAnimating = false (at timeline.onComplete) ✅
//TODO Fix the bug when exit the masterTimeline got snatched back a little bit
import { useRef, useEffect, useState, useContext } from 'react'
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei'
import * as THREE from "three";
import { gsap } from "gsap";
import { useFrame } from '@react-three/fiber';

import { v4 as uuidv4 } from 'uuid';

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import { States } from "../../Home.jsx";

import { PostsState } from "../maindisplay.jsx";
import Model from "/models/demo_1.glb";

import { 
  getFallingTime, 
  getRandomZLocation, 
  getRandomXLocation, 
  getYLocation, 
  getRandomizedRotation,
  Shuffle,
  getCameraOffset
} from '../../utilFunctions/scene-utils.js';


export const Objects = (props, canvas) => {
  //* States
  const {activeScreen, setAppStates, isFalling} = useContext(States);
  const {postsQueue, setPostsQueue} = useContext(PostsState);
  const [objects, setObjects] = useState(null);
  const [renderedObjects, setRenderedObjects] = useState([]);

  //* Refreshing states
  const [count, setCount] = useState(0);
  const isObjectHovered = useRef(false);

  //* ScrollTrigger to control timelines speed;
  const mainCanvas = useRef(document.getElementById("MAIN-SCREEN"));

  //* Falling Objects Array
  const renderedObjectsRefs = useRef([]);

  const masterTimeline = useRef();
  const speedTimeline = useRef({
    timeline: null,
  });
  const masterScrollTrigger = useRef();

  const hoveredOverObject = useRef(null);

  const camOriginalPosition = useRef(new THREE.Vector3());

  const { scene, nodes, materials } = useGLTF(Model);
  const { camera } = useThree();

  const _numOfObjectsBeforeNextTimeline = 3;

  //* Create masterTimeline, speedTimeline, and masterScrollTrigger
  useEffect(() => {

    const mastertl = gsap.timeline();

    const speed_Timeline = gsap.timeline();
    speed_Timeline.set(mastertl, {
      timeScale: -3
    });
    speed_Timeline.to(mastertl, {
      timeScale: 3,
      ease: "linear",
    });

    const master_ScrollTrigger = ScrollTrigger.create({
      animation: speed_Timeline,
      trigger: mainCanvas.current,
      toggleAction: "restart pause reverse pause",
      start: "top top",
      end: "+=2000 bottom",
      scrub: 2,
      pin: true,
    });

    console.log(speed_Timeline);

    masterTimeline.current = mastertl;
    speedTimeline.current.timeline = speed_Timeline;
    masterScrollTrigger.current = master_ScrollTrigger;

    return () => {
      masterTimeline.current?.kill();
      speedTimeline.current?.timeline?.kill();
      masterScrollTrigger.current?.kill();
    };

  }, []);

  //* ------------------------Animate objects in objects reference------------------------
  useEffect(() => {

    if (renderedObjectsRefs.current.length > 0) {

      renderedObjectsRefs.current.forEach((object, index) => {

        if (object.userData.isAddedToTimeline) return;

        const tl = gsap.timeline();

        object.userData.isAddedToTimeline = true;

        const boundingBox = new THREE.Box3().setFromObject(object);
        const boundingBoxSize = boundingBox.getSize(new THREE.Vector3());
        const boundingBoxVolume = boundingBoxSize.x * boundingBoxSize.y * boundingBoxSize.z;

        const zLocation = getRandomZLocation(boundingBoxVolume);
        const xLocation = getRandomXLocation(zLocation, camera);
        const yLocation = getYLocation(zLocation, camera);

        const duration = getFallingTime(zLocation);

        object.position.set(xLocation, yLocation, zLocation);

        object.rotation.copy(getRandomizedRotation(0, 0, 0, 10));

        //* Gsap to this position and rotation
        tl.to(object.position, {
          x: xLocation,
          y: -yLocation,
          z: zLocation,
          ease: "none",
          duration: duration,
          onComplete: () => {setPostsQueue((prev) => {

            let temporaryCopy = [];

            prev.forEach(post => {
              if (post.id !== object.userData.post.id) {
                post.isAddedToAnimation = true;
                temporaryCopy.push(post);
              };
            });

            return temporaryCopy;

          })}
        });

        const desiredStart = index === 0 ? masterTimeline.current.totalDuration() 
                                         : masterTimeline.current.totalDuration() - 3;

        const safeStart = Math.max(desiredStart, masterTimeline.current.time());

        masterTimeline.current.add(tl, safeStart);

      });

    };

  }, [objects, renderedObjects]);


  //* ------------------------Load mesh and add meshes to reference array------------------------

  //* Add all the 3d objects into the objects state
  useEffect(() => {

    //? Saved camera initial position
    camOriginalPosition.current.copy(camera.position);

    //? Save all model "molds" to a state
    let temp = [];

    scene.traverse((children) => {

      if (children.isMesh) {

        temp.push(children);

      };

    });

    setObjects(temp);

  }, []);

  //* Load objects for animation
  const loadAnimatingObjects = () => {

    if (postsQueue.length < 1 || !objects) return;

    postsQueue.forEach((post, index) => {

        if (post.isAddedToAnimation) return;

        let meshCreatedByObject;

        const object = post.object ? objects[post.object] : objects[Math.floor(Math.random() * objects.length)];

        meshCreatedByObject = 
          <mesh
            ref = {(mesh) => {
              if (mesh && !renderedObjectsRefs.current.includes(mesh)) {
                mesh.name = object.name;
                mesh.userData.isAddedToTimeline = false;
                mesh.userData.post = post;
                renderedObjectsRefs.current.push(mesh);
              };
            }}
            castShadow
            receiveShadow
            geometry = {object.geometry}
            material = {materials['MergedBake_Baked.003']}
            onPointerEnter = {handle3DObjectPointerEnter}
          />;

        setRenderedObjects(prev => [...prev, meshCreatedByObject]);

    });

  };
  useEffect(loadAnimatingObjects, [postsQueue, objects]);

  //* ------------------------GSAP------------------------
  //* GSAPs
  // const moveCameraToOriginalPosition = () => {

  //   hoveredOverObject.current = null;

  //   const tl = gsap.timeline();

  //   tl.to(camera.position, {
  //       x: camOriginalPosition.current.x,
  //       y: camOriginalPosition.current.y,
  //       z: camOriginalPosition.current.z,
  //       ease: "power1.inOut",
  //       duration: 2,
  //       onComplete: () => {

  //         const middlePositionOfScroll = (masterScrollTrigger.current.start + masterScrollTrigger.current.end) / 2;

  //         const startTween = speedTimeline.current.timeline.getChildren()[0];
  //         const endTween = speedTimeline.current.timeline.getChildren()[1];

  //         speedTimeline.current.timeline.remove(startTween);
  //         speedTimeline.current.timeline.remove(endTween);

  //         speedTimeline.current.timeline.set(masterTimeline, {
  //           timeScale: -3,
  //         });
  //         speedTimeline.current.timeline.to(masterTimeline, {
  //           timeScale: 3,
  //           ease: 'linear',
  //         });
  //         masterScrollTrigger.current.update();
  //         masterScrollTrigger.current.scroll(middlePositionOfScroll + 100);

  //       },
  //   });

  // };

  useEffect(() => {

    if (!speedTimeline.current.timeline || !masterScrollTrigger.current) return;

    if (isFalling) {

      hoveredOverObject.current = null;

      const tl = gsap.timeline();

      tl.to(camera.position, {
          x: camOriginalPosition.current.x,
          y: camOriginalPosition.current.y,
          z: camOriginalPosition.current.z,
          ease: "power1.inOut",
          duration: 2,
          onComplete: () => {

            isObjectHovered.current = false;

            const middlePositionOfScroll = (masterScrollTrigger.current.start + masterScrollTrigger.current.end) / 2;

            const startTween = speedTimeline.current.timeline.getChildren()[0];
            const endTween = speedTimeline.current.timeline.getChildren()[1];

            speedTimeline.current.timeline.remove(startTween);
            speedTimeline.current.timeline.remove(endTween);

            speedTimeline.current.timeline.set(masterTimeline.current, {
              timeScale: -3,
            });
            speedTimeline.current.timeline.to(masterTimeline.current, {
              timeScale: 3,
              ease: "linear",
            });
            masterScrollTrigger.current.scroll(middlePositionOfScroll + 200);
            masterScrollTrigger.current.update();

          },
      });

    };

  }, [isFalling])

  //* Utils functions
  const handle3DObjectPointerEnter = async (event) => {

    if (!isObjectHovered.current) {

      isObjectHovered.current = true;

      const intersectObject = event.object;

      //* Set scroller to the middle to stop falling animation
      const middlePositionOfScroll = (masterScrollTrigger.current.start + masterScrollTrigger.current.end) / 2;
      masterScrollTrigger.current.scroll(middlePositionOfScroll);

      await new Promise((r) => setTimeout(r, 1000));

      hoveredOverObject.current = event.object;

      const startTween = speedTimeline.current.timeline.getChildren()[0];
      const endTween = speedTimeline.current.timeline.getChildren()[1];

      //? Replace the old tweens with new tweens of speedtimeline so that object can stand still
      speedTimeline.current.timeline.remove(startTween);
      speedTimeline.current.timeline.remove(endTween);
      
      speedTimeline.current.timeline.set(masterTimeline.current, {
        timeScale: 0,
      });
      speedTimeline.current.timeline.to(masterTimeline.current, {
        timeScale: 0,
        ease: "linear",
      });
      masterScrollTrigger.current.update();

      const boundingBox = new THREE.Box3().setFromObject(intersectObject);
      const boundingBoxCenter = boundingBox.getCenter(new THREE.Vector3());

      const [xCameraOffset, zCameraOffset] = getCameraOffset(intersectObject.position.z);

      const tl = gsap.timeline();

      tl.to(camera.position, {

        x: boundingBoxCenter.x,
        y: boundingBoxCenter.y,
        z: boundingBoxCenter.z + zCameraOffset,
        ease: "power1.inOut",
        duration: 2,

      });
      
      tl.to(camera.position, {

        x: boundingBoxCenter.x + xCameraOffset,
        ease: "power1.inOut",
        duration: 1,
        onComplete: () => {

          setAppStates(true, false, "post-screen", false, intersectObject.userData.post);

        },

      }, ">");

    };
  
  };

  //* UseFrame to slightly rotating 3d object if 
  useFrame((state) => {

    if (hoveredOverObject.current) {

      const pointer = state.pointer;

      const dampingFactorX = 0.01;
      const dampingFactorY = 0.001;

      const currRotation = new THREE.Euler().copy(hoveredOverObject.current.rotation);

      const targetRotationX = ( Math.PI / 12 ) * pointer.y;
      const targetRotationY = - ( Math.PI / 3 ) * pointer.x + currRotation.y;

      const deltaX = ( targetRotationX - currRotation.x ) * dampingFactorX;
      const deltaY = ( targetRotationY - currRotation.y ) * dampingFactorY;

      hoveredOverObject.current.rotation.x = currRotation.x + deltaX;
      hoveredOverObject.current.rotation.y = currRotation.y + deltaY;

      hoveredOverObject.current.rotation.y += 0.0005;

    };

  });

  return (
    <group {...props}>
      {renderedObjects}
    </group>
  )
}


