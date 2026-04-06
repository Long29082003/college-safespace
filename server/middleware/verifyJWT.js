import jwt from "jsonwebtoken";
import 'dotenv/config';

export function verifyJWT (req, res, next) {
    if (!req.headers["authorization"]) res.sendStatus(401);
    
    const accessToken = req.headers["authorization"].split(" ")[1];
    jwt.verify(
        accessToken, 
        process.env.ACCESS_SECRET,
        (error, decoded) => {
            if (error) return res.sendStatus(403);
            next();
        });
};