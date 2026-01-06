export const tilting = (event, ref, translateScale, rotateScale) => {
    const {clientX, clientY} = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const middleScreenX = rect.left + rect.width/2;
    const middleScreenY = rect.top + rect.height/2;
    const dx = (clientX - middleScreenX);
    const dy = (clientY - middleScreenY);
    const translateXPixel = -dx * translateScale;
    const translateYPixel = -dy * translateScale;
    const tiltYDegree = dx/middleScreenX * rotateScale;
    const tiltXDegree = -dy/middleScreenY * rotateScale;    

    ref.current.style.transform = `rotateX(${tiltXDegree}deg) 
                                                rotateY(${tiltYDegree}deg)
                                                translateX(${translateXPixel}px)
                                                translateY(${translateYPixel}px)`;
};