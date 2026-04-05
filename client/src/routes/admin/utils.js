export const lerp = (progress, startClr, endClr) => {
    if (!startClr || !endClr) return new Error("Must pass in all arguments");
    const r = startClr.r + (endClr.r - startClr.r) * progress;
    const g = startClr.g + (endClr.g - startClr.g) * progress;
    const b = startClr.b + (endClr.b - startClr.b) * progress;
    
    return `rgb(${r}, ${g}, ${b})`;
};