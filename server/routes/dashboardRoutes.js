import express from "express";
import { handlePostSummarization, handleReactionSummarization, handleCommentSummarization, handleGetPostForMorePostsScreen } from "../controllers/dashboardControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/postinfo", verifyJWT, handlePostSummarization);

dashboardRoute.get("/reactioninfo", verifyJWT, handleReactionSummarization);

dashboardRoute.get("/commentinfo", verifyJWT, handleCommentSummarization);

dashboardRoute.get("/postwithreactions", verifyJWT, handleGetPostForMorePostsScreen);