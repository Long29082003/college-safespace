import express from "express";

import { handleGetSubmittedPosts, handleFlagSubmittedPost } from "../controllers/adminControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const adminRoute = express.Router();

adminRoute.get("/submitted-posts", verifyJWT, handleGetSubmittedPosts);

adminRoute.post("/flag-submitted-post", verifyJWT, handleFlagSubmittedPost);