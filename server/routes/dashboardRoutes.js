import express from "express";
import { handlePostSummarization, handleReactionSummarization, handleCommentSummarization, handleGetPostForMorePostsScreen } from "../controllers/dashboardControllers.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/postinfo", verifyJWT, handlePostSummarization);

dashboardRoute.get("/reactioninfo", handleReactionSummarization);

dashboardRoute.get("/commentinfo", handleCommentSummarization);

dashboardRoute.get("/postwithreactions", handleGetPostForMorePostsScreen);