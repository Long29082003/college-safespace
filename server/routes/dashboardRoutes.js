import express from "express";
import { handlePostSummarization } from "../controllers/dashboardControllers.js";

export const dashboardRoute = express.Router();

dashboardRoute.get("/postinfo", handlePostSummarization);