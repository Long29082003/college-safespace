const whiteList = ["http://localhost:5173"]

export const corsOption = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed: CORS"));
        }
    },
    optionSuccessStatus: 200,
    credentials: true
};

export const credential = (req, res, next) => {
    const origin = req.headers.origin;
    if (whiteList.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    };
    next();
};