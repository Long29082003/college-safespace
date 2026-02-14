import express from "express";
import { handlePostSummarization, handleReactionSummarization, handleCommentSummarization, handleGetPostForMorePostsScreen } from "../controllers/dashboardControllers.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/postinfo", handlePostSummarization);

dashboardRoute.get("/reactioninfo", handleReactionSummarization);

dashboardRoute.get("/commentinfo", handleCommentSummarization);

dashboardRoute.get("/postwithreactions", handleGetPostForMorePostsScreen);