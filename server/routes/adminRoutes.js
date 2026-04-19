import express from "express";

import { handleGetSubmittedPosts } from "../controllers/adminControllers.js";

export const adminRoute = express.Router();

adminRoute.get("/submitted-posts", handleGetSubmittedPosts);