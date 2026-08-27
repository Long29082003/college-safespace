import * as THREE from "three";

const _MIN_VOLUME = 1;
const _MAX_VOLUME = 67;
const _MIN_DISTANCE = 4;
const _MAX_DISTANCE = 24;
const _ZRANDOMNESS = 2;

const _MIN_TIME = 4;
const _MAX_TIME = 10;
const _TIMERANDOMNESS = 1;

const _GAMMA = 0.85;

const _YBUFFER = 5;

export const getFallingTime = (zLocation) => {

    const t = THREE.MathUtils.clamp(
        (Math.abs(zLocation) - _MIN_DISTANCE) / (_MAX_DISTANCE - _MIN_DISTANCE),
        0,
        1
    );

    const time = _MIN_TIME + (_MAX_TIME - _MIN_TIME) * t;

    const timeOffset = (Math.random() * 2 - 1) * _TIMERANDOMNESS;

    return THREE.MathUtils.clamp(
        time + timeOffset,
        _MIN_TIME,
        _MAX_TIME,
    );

};

export const getRandomZLocation = (objectVolume) => {

    const t = THREE.MathUtils.clamp(
        (Math.log(objectVolume) - Math.log(_MIN_VOLUME)) / (Math.log(_MAX_VOLUME) - Math.log(_MIN_VOLUME)),
        0,
        1
    );

    const distance = _MIN_DISTANCE + (_MAX_DISTANCE - _MIN_DISTANCE) * Math.pow(t, _GAMMA);

    const randomOffset = (Math.random() * 2 - 1) * _ZRANDOMNESS;

    return -(THREE.MathUtils.clamp(
        distance + randomOffset,
        _MIN_DISTANCE,
        _MAX_DISTANCE
    ));
};

export const getRandomXLocation = (zLocation, camera) => {

    const fov = camera.fov;
    const aspect = camera.aspect;

    const horizontalFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(fov/2)) * aspect);

    const xDistanceAllowance = Math.tan(horizontalFov / 2) * Math.abs(zLocation);
    
    const xDistance = ( Math.random() * 2 - 1 ) * xDistanceAllowance;

    return xDistance;

};
export const getYLocation = (zLocation, camera) => {

    const fov = camera.fov;
    
    return Math.tan(THREE.MathUtils.degToRad(fov) / 2) * Math.abs(zLocation) + _YBUFFER;

};


export const getRandomizedRotation = (x, y, z, delta) => {

    return new THREE.Euler(
        THREE.MathUtils.degToRad(x) + THREE.MathUtils.degToRad((Math.random() * 2 - 1) * delta),
        THREE.MathUtils.degToRad(y) + THREE.MathUtils.degToRad((Math.random() * 2 - 1) * delta),
        THREE.MathUtils.degToRad(z) + THREE.MathUtils.degToRad((Math.random() * 2 - 1) * delta),
    );

};

export const Shuffle = (array, animatingObjects) => {
    //* Shuffle the array without animating objects 
    const mainShuffledArray = array.filter(object => {
        if (!animatingObjects.includes(object)) {
            return object
        } else {
            return false;
        };
    });

    for (let i = mainShuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [mainShuffledArray[i], mainShuffledArray[j]] = [mainShuffledArray[j], mainShuffledArray[i]];
    };

    const animatingObjectsArray = [...animatingObjects];

    for (let i = animatingObjectsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [animatingObjectsArray[i], animatingObjectsArray[j]] = [animatingObjectsArray[j], animatingObjectsArray[i]];
    };

    let randomIndexes = [];

    for (let i = 0; i < animatingObjects.length; i++) {
        const index = Math.floor(Math.random() * mainShuffledArray.length) - animatingObjectsArray.length;
        randomIndexes.push(index);
    };

    randomIndexes.forEach((randomIndex, arrayIndex) => {
        const addIndex = (3 + arrayIndex) + randomIndex;
        mainShuffledArray.splice(addIndex, 0, animatingObjectsArray[arrayIndex])
    });

    return mainShuffledArray ;
};

export const getCameraOffset = (zLocation) => {

    zLocation = Math.abs(zLocation);

    const X_MAX_OFFSET = 6;
    const X_MIN_OFFSET = 1.2;

    const Z_MAX_OFFSET = 15;
    const Z_MIN_OFFSET = 2;

    const t = (zLocation - _MIN_DISTANCE) / (_MAX_DISTANCE - _MIN_DISTANCE);

    const zOffset = Z_MIN_OFFSET + (Z_MAX_OFFSET - Z_MIN_OFFSET) * t;
    const xOffset = X_MIN_OFFSET + (X_MAX_OFFSET - X_MIN_OFFSET) * Math.pow(t, _GAMMA);

    return [xOffset, zOffset];

};