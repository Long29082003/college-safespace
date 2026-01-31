import express from "express";
import { handlePostSummarization, handleReactionSummarization } from "../controllers/dashboardControllers.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/postinfo", handlePostSummarization);

dashboardRoute.get("/reactioninfo", handleReactionSummarization);