export const postScrollingKeyFrames = [
    {
        opacity: 0,
        transform: `
            translateX(calc(0% + var(--left-position)))
            translateY(calc(-120% + var(--top-position)))
            translateZ(-200px)
            `,
        offset: 0
    }, {
        opacity: 0.6,
        transform: `
            translateX(calc(7% + var(--left-position)))
            translateY(calc(-60% + var(--top-position)))
            translateZ(0px)
            `,
        offset: 0.12
    }, {
        opacity: 0.9,
        transform: `
            translateX(calc(16% + var(--left-position)))
            translateY(calc(10% + var(--top-position)))
            translateZ(200px)
            `,
        offset: 0.25
    }, {
        opacity: 1,
        transform: `
            translateX(calc(30% + var(--left-position)))
            translateY(calc(70% + var(--top-position)))
            translateZ(500px)
            `,
        offset: 0.40
    }, {
        opacity: 1,
        transform: `
            translateX(calc(44% + var(--left-position)))
            translateY(calc(110% + var(--top-position)))
            translateZ(800px)
            `,
        offset: 0.55
    }, {
        opacity: 1,
        transform: `
            translateX(calc(60% + var(--left-position)))
            translateY(calc(165% + var(--top-position)))
            translateZ(950px)
            `,
        offset: 0.68
    }, {
        opacity: 0.5,
        transform: `
            translateX(calc(75% + var(--left-position)))
            translateY(calc(230% + var(--top-position)))
            translateZ(1050px)
            `,
        offset: 0.82
    }, {
        opacity: 0,
        transform: `
            translateX(calc(90% + var(--left-position)))
            translateY(calc(310% + var(--top-position)))
            translateZ(1150px)
            `,
        offset: 1
    }
];

export const postScrollingTiming = {
    duration: 20000,
    fill: "forwards"
};