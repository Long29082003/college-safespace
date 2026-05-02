import express from "express";

import { handleGetSubmittedPosts, handleGetFlaggedSubmittedPosts, handleFlagSubmittedPost } from "../controllers/adminControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const adminRoute = express.Router();

adminRoute.get("/submitted-posts", verifyJWT, handleGetSubmittedPosts);

adminRoute.get("/flagged-submitted-posts", verifyJWT, handleGetFlaggedSubmittedPosts);

adminRoute.post("/flag-submitted-post", verifyJWT, handleFlagSubmittedPost);